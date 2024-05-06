import json
import math
from dateutil import parser, tz
from datetime import timedelta, datetime

export_filename = 'export.json'
submissions = []
top_75 = []
best_score = dict()
ep_table = {x: [] for x in range(7, 15)}

def ex_to_ep(ex):
    if ex <= 8500:
        return 0
    return math.floor((100**((ex-8500)/1500) - 1) * (1000/99))

def ep_meter_count(x):
    return 15-x if x >= 11 else x - 6

def generate_top_75(best_score):
    top_75 = []

    for id in best_score:
        top_75.append(best_score[id])
    top_75.sort(key=lambda x: x['points'], reverse=True)

    return top_75[:75]

def generate_ep_table(best_score):
    ep_table = {x: [] for x in range(7, 15)}

    for id in best_score:
        entry = best_score[id]
        if entry['meter'] <= 14:
            ep_table[entry['meter']].append(entry)
    for x in range(7, 15):
        ep_table[x].sort(key=lambda x: x['ex'], reverse=True)
        ep_table[x] = ep_table[x][:ep_meter_count(x)]

    return ep_table

def update_best_scores(new_scores, best_score=None):
    if best_score is None:
        best_score = dict()
    
    for entry in new_scores:
        id = entry['id']
        if id not in best_score:
            best_score[id] = entry
        elif best_score[id]['ex'] <= entry['ex']:
            best_score[id] = entry
    
    return best_score

def group_into_sessions(submissions):
    sessions = []
    current_session, submissions = submissions[:1], submissions[1:]

    for submission in submissions:
        timediff = parser.isoparse(submission['dateAdded']) - parser.isoparse(current_session[-1]['dateAdded'])
        if timediff > timedelta(hours=2):
            sessions.append(current_session)
            current_session = []
        current_session.append(submission)
    sessions.append(current_session)

    return sessions

def generate_snapshots(sessions):
    top_75 = []
    best_score = dict()
    ep_table = {x: [] for x in range(7, 15)}
    snapshots = []

    # Prepend an 'empty' snapshot representing the state at the start of the event
    snapshots.append({
        'session_start':'2024-03-08T12:00:00.000Z',
        'session_end':'2024-03-08T12:00:00.000Z',
        'epoch_start': parser.isoparse('2024-03-08T12:00:00.000Z').timestamp(),
        'epoch_end': parser.isoparse('2024-03-08T12:00:00.000Z').timestamp(),
        'top_75': [],
        'ep_table': {x: [] for x in range(7, 15)},
        'sp': 0,
        'ep': 0,
        'rp': 0,
        'sp_gain': 0,
        'ep_gain': 0,
        'rp_gain': 0,
        'total_submissions': 0,
    })

    for session in sessions:
        session_start = session[0]['dateAdded']
        session_end = session[-1]['dateAdded']
        best_score = update_best_scores(session, best_score)
        top_75 = generate_top_75(best_score)
        ep_table= generate_ep_table(best_score)
        sp = sum(x['points'] for x in top_75)
        ep = sum((sum(x['ep'] for x in ep_table[key]) for key in ep_table))
        rp = sp + ep
        snapshot = {
            'session_start': session_start,
            'session_end': session_end,
            'epoch_start': parser.isoparse(session_start).timestamp(),
            'epoch_end': parser.isoparse(session_end).timestamp(),
            'top_75': top_75,
            'ep_table': ep_table,
            'sp': sp,
            'ep': ep,
            'rp': rp,
            'total_submissions': snapshots[-1]['total_submissions'] + len(session),
        }
        snapshots.append(snapshot)

    for i in range(1, len(snapshots)):
        for point_type in ['rp', 'ep', 'sp']:
            gain = snapshots[i][point_type] - snapshots[i-1][point_type]
            snapshots[i][point_type+'_gain'] = gain

    # Append an empty session representing the current state
    snapshots.append(snapshots[-1].copy())
    now = datetime.now(tz.tzutc())
    snapshots[-1]['session_start'] = now.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
    snapshots[-1]['session_end'] = now.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
    snapshots[-1]['epoch_start'] = now.timestamp()
    snapshots[-1]['epoch_end'] = now.timestamp()
    for point_type in ['rp', 'ep', 'sp']:
        snapshots[-1][point_type+'_gain'] = 0

    return snapshots

def generate_compressed_snapshots(snapshots):
    return [{key: snapshot[key] for key in ['session_start', 'session_end', 'sp', 'ep', 'rp', 'sp_gain', 'ep_gain', 'rp_gain', 'epoch_start', 'epoch_end', 'total_submissions']} for snapshot in snapshots]

# G
with open(export_filename, encoding='utf-8') as json_data:
    info = json.load(json_data)

for chart in info['charts']:
    for score in chart['scores']:
        entry = {
            'dateAdded': score['dateAdded'],
            'id': chart['id'],
            'title': chart['titleRomaji'] if chart['titleRomaji'] else chart['title'],
            'meter': chart['meter'],
            'maxPoints': chart['points'],
            'ex': score['ex'],
            'points': score['points'],
            'ep': ex_to_ep(score['ex']),
        }
        submissions.append(entry)

submissions.sort(key=lambda x: x['dateAdded'])
sessions = group_into_sessions(submissions)
by_entry = [[x] for x in submissions]
snapshots = generate_snapshots(sessions)

with open('timeline.json', "w") as file:
    json.dump(snapshots, file)

with open('timeline_compressed.json', "w") as file:
    json.dump(generate_compressed_snapshots(snapshots), file)