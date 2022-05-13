import json
import numpy
from datetime import datetime, timedelta

# A function that calculates the distance between two points
def find_distance(point1, point2):
    vector_dist = [point1['x'] - point2['x'], point1['y'] - point2['y'], point1['z'] - point2['z']]
    return numpy.linalg.norm(vector_dist)

# A function used to determine whether two points are close enough together to be considered a hit
def isHit(point1, point2):
    return find_distance(point1, point2) < 0.1

# A function that uses binary search that to find the range of distances
def search_distance_range(distances, dist):
    lower = 0
    upper = len(distances)
    while lower < upper:
        mid = int((lower + upper) / 2)
        if distances[mid - 1] < dist < distances[mid]:
            return distances[mid]
        elif distances[mid] < dist:
            lower = mid
        elif distances[mid] > dist:
            upper = mid
        else:
            return distances[mid]
    return distances[mid] 

# METRIC ANALYSIS: Number of Hits and Misses & Average Time Spent
def findHitsAndMissesAndTimeSpent(targets_list, time_stamps, json_dict):
    first_time_stamp = int(float(list(time_stamps)[0]))
    total_targets = len(targets_list)
    hits = 0
    time_hit = {}

    # Loops through each time stamp in the session file
    for timestamp in time_stamps:
        # Normalize time stamp ensures that the timestamp always starts at 0 seconds
        normalized_time_stamp = float(timestamp) - float(first_time_stamp)
        rh_position = json_dict[timestamp][3]["position"]
        lh_position = json_dict[timestamp][4]["position"]

        if len(targets_list) == 0: # All Targets Hit
            break

        # Loops through the targets from the template file

        for index, target in enumerate(targets_list):
            if float(target["Time"]) < normalized_time_stamp:
                # Checks whether the left or right anchors hit the targets
                if isHit(rh_position, target["Position"]) and "Right" in target["Name"]:
                    hits += 1
                    time_hit[normalized_time_stamp, (targets_list[index]["Time"])] = targets_list[index]["Name"]
                    del targets_list[index]
                    break
                if isHit(lh_position, target["Position"]) and "Left" in target["Name"]:
                    hits += 1
                    time_hit[normalized_time_stamp, (targets_list[index]["Time"])] = targets_list[index]["Name"]
                    del targets_list[index]
                    break
                if isHit(rh_position, target["Position"]) or isHit(lh_position, target["Position"]): 
                    hits += 1
                    time_hit[normalized_time_stamp, (targets_list[index]["Time"])] = targets_list[index]["Name"]
                    del targets_list[index]
                    break

    misses = total_targets - hits

    target_time_until_hit = []
    total_time_until_hit = 0
    average_time_until_hit = 0

    # Calculates the time for each target and the average target time
    if (len(time_hit.keys()) > 0):
        for i in time_hit.keys():
            difference = float(i[0]) - i[1]
            total_time_until_hit += difference
            target_time_until_hit.append({"target" : time_hit[i], "timeUntilHit" : difference})
        # Calculates average target time
        average_time_until_hit = total_time_until_hit / len(time_hit.keys())

    return (hits, misses, target_time_until_hit, average_time_until_hit)


# METRIC ANALYSIS: Functional Mobility Indicators
def findMobilityIndicators(json_dict):
    distances = numpy.array(range(0, 205, 5))
    # Variables used for calculating space coverage
    left_arm_distance_counter = dict()
    right_arm_distance_counter = dict()
    for distance in distances: # Initialize counters
        left_arm_distance_counter[str(distance)] = 0
        right_arm_distance_counter[str(distance)] = 0

    # Variables used for calculating individual joint speeds
    head_speeds = dict()
    left_arm_speeds = dict()
    right_arm_speeds = dict()
    head_speed_list = []
    left_arm_speed_list = []
    right_arm_speed_list = []
    prev_time = 0
    found_nonzero_pos = False # flag that is used once to find the first nonzero position of headset
    start_pos = {'x': 0, 'y': 0, 'z': 0}
    prev_head_pos = {'x': 0, 'y': 0, 'z': 0}
    prev_left_arm_pos = {'x': 0, 'y': 0, 'z': 0}
    prev_right_arm_pos = {'x': 0, 'y': 0, 'z': 0}

    # Variables used for calculating average joint speeds
    timer = 0
    head_avg_speed = 0
    left_arm_avg_speed = 0
    right_arm_avg_speed = 0
    

    # Screenshot is the list of Anchors' position, rotation, and name
    # Loops through the timestamps of the session file and calculates the joint speeds and space coverage
    for time, screenshot in json_dict.items():
        # Finding the first tracked positions of the headset
        if screenshot[0]['position'] == start_pos:
            continue
        elif screenshot[0]['position'] != start_pos and not found_nonzero_pos:
            prev_head_pos = screenshot[0]['position']
            prev_left_arm_pos = screenshot[4]['position']
            prev_right_arm_pos = screenshot[3]['position']
            found_nonzero_pos = True
            timer = float(time)

        # Positions for the head, left arm and right arm
        time = float(time)
        head_pos = screenshot[0]['position']
        left_arm_pos = screenshot[4]['position']
        right_arm_pos = screenshot[3]['position']
        
        # Calculates Individual Joint Speed and Average Joint Speed for head, left arm and right arm
        # Every speed is measured in centimeters per second
        if time - timer >= 1: # Condition that ensures the timestamp analyzed is for each second instead of each millisecond
            head_speeds[str(time)] = sum(head_speed_list) / len(head_speed_list)
            left_arm_speeds[str(time)] = sum(left_arm_speed_list) / len(left_arm_speed_list)
            right_arm_speeds[str(time)] = sum(right_arm_speed_list) / len(right_arm_speed_list)
            head_avg_speed += head_speeds[str(time)]
            left_arm_avg_speed += left_arm_speeds[str(time)]
            right_arm_avg_speed += right_arm_speeds[str(time)]
            head_speed_list.clear()
            left_arm_speed_list.clear()
            right_arm_speed_list.clear()
            timer = time
        head_speed_list.append(find_distance(head_pos, prev_head_pos) / (time - prev_time) * 100)
        left_arm_speed_list.append(find_distance(left_arm_pos, prev_left_arm_pos) / (time - prev_time) * 100)
        right_arm_speed_list.append(find_distance(right_arm_pos, prev_right_arm_pos) / (time - prev_time) * 100)

        # Space coverage is measured in centimeters
        # Finds the distance between the head and left/right joint
        dist = find_distance(left_arm_pos, head_pos) * 100
        distance_range = search_distance_range(distances, dist)
        left_arm_distance_counter[str(distance_range)] += 1

        dist = find_distance(right_arm_pos, head_pos) * 100
        distance_range = search_distance_range(distances, dist)
        right_arm_distance_counter[str(distance_range)] += 1

        prev_head_pos = head_pos
        prev_left_arm_pos = left_arm_pos
        prev_right_arm_pos = right_arm_pos
        prev_time = time

    # Eliminates all ranges where the joints were not at that specific range
    for i in range(len(distances)):
        if left_arm_distance_counter[str(distances[i])] == 0:
            left_arm_distance_counter.pop(str(distances[i]))
        if right_arm_distance_counter[str(distances[i])] == 0:
            right_arm_distance_counter.pop(str(distances[i]))

    # Calculates the average joint speeds for head, left arm and right arm
    speed_num = len(head_speeds)
    head_avg_speed /= speed_num
    left_arm_avg_speed /= speed_num
    right_arm_avg_speed /= speed_num
    return head_speeds, left_arm_speeds, right_arm_speeds, head_avg_speed, left_arm_avg_speed, right_arm_avg_speed, left_arm_distance_counter, right_arm_distance_counter


# Analyze all metrics
def analyzeMetrics(targets_list, json_dict):
    # Session header that contains session information
    header          = json_dict.pop('Session')
    username        = header['UserName']
    date_time       = header['Date']
    device_id       = header['DeviceId']
    version         = header['Version']

    time_stamps = json_dict.keys()


    ### METRIC ANALYSIS ###
    # METRIC ANALYSIS: Time Spent on Game
    first_time_stamp = int(float(list(time_stamps)[0]))
    start_time = datetime.strptime(date_time,'%Y-%m-%dT%H.%M.%S')
    last_time_stamp = int(float(list(time_stamps)[-1]))
    time_spent = last_time_stamp - first_time_stamp
    end_time = start_time + timedelta(seconds=time_spent)

    hits, misses, target_time_until_hit, average_time_until_hit = findHitsAndMissesAndTimeSpent(targets_list, time_stamps, json_dict)

    mobilityMetrics = findMobilityIndicators(json_dict)
    # Dictionaries that contain individual joint speed at time T
    head_speeds, left_arm_speeds, right_arm_speeds = mobilityMetrics[0:3]
    # Average speed of individual joints
    head_avg_speed, left_arm_avg_speed, right_arm_avg_speed = mobilityMetrics[3: 6]
    # Dictionaries that contain space coverage of each joint except for head
    left_arm_distance_counter, right_arm_distance_counter = mobilityMetrics[6:]


    # Reponse to send
    response = {
        "deviceId": device_id,
        "hits": hits,
        "misses": misses,
        "averageHitSpeed": average_time_until_hit,
        "startTime": start_time,
        "endTime": end_time,
        "version": version,
        "username": username,
        "targetHitSpeedList": target_time_until_hit,
        "leftArmSpeedList": left_arm_speeds,
        "rightArmSpeedList": right_arm_speeds,
        "headSpeedList": head_speeds,
        "leftArmAvgSpeed": left_arm_avg_speed,
        "rightArmAvgSpeed": right_arm_avg_speed,
        "headAvgSpeed": head_avg_speed,
        "leftArmSpaceCoverage": left_arm_distance_counter,
        "rightArmSpaceCoverage": right_arm_distance_counter
    }

    return response