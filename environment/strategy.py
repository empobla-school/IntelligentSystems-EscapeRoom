# Strategies for: Rewards, Punishment
# Actions: Possiblities

'''
0000000000000000000000000000000 +z
..........0.0...............0.0
0.0000000.0.0.0.00000000000.0.0
0.0...0...0...0.......0.......0
0.000.00000.000000000.0.0000000
0.......0.0...0.0...0.0.0.....0
0000000.0.000.0.0.0.0.000.000.0
0.....0.0...0.0...0.0.....0.0.0
0.000.0.0.000.000.0.00000.0.0.0
0.0...0.0.......0.0.0...0...0.0
0.0.000.0000000.000.0.0.000.0.0
0.0...0.....0.0.0...0.0.0...0.0
0.0.0000000.0.0.0.0.0.0.00000.0
0.0.0.......0.0.0.0.0.0.......0
0.000.0000000.0.0.0.0.0000000.0
0.0...0.......0...0.0.....0...0
0.0.0000000.0000000.00000.0.000
0.0.......0.0...0...0.....0...0
0.0000000.0.0.0.0.000.000000000
0.......0.0.0.0.....0.........0
0.00000.0.0.0.0000000.0000000.0
0.....0...0.0.0.....0...0.....0
00000.00000.0.0.000.000.0.000.0
0...0.0.......0...0...0.0...0.0
000.0.000000000.0.000.000.0.0.0
0...0.........0.0.0.0...0.0.0.0
0.00000000000.000.0.000.0.0.000
0.....0.....0.0...0.0...0.0...0
0.000.0.000.0.0.000.0.0000000.0
0...0.....0.....0..............
0000000000000000000000000000000 -z
-x                            +x
'''

class Agent:
    def __init__(self, x, y) -> None:
        self.x = x
        self.y = y
    
    def position(self):
        return [self.x, self.y]
    
    def move(self, movement):
        # agent.moveHorizontal(-1 || 1)
        # agent.moveVertical(-1 || 1)
        move_vertical, move_horizontal = movement
        # Move agent (visually)
        # ...
        self.x += move_horizontal
        self.y += move_vertical


def compute_manhattan_distance(position_a, position_b):
    return sum([abs(a - b) for a, b in zip(position_a, position_b)])


def update_agent(agent, movement, goal_position):
    # Reward if nearer to the thief, else punish
    
    # Get current position and next position (after movement)
    old_position = agent.position()
    agent.move(movement)
    new_position = agent.position()

    # Compute manhattan distances for old and new position
    old_distance =  compute_manhattan_distance(old_position, goal_position) # Get the previous distance
    new_distance =  compute_manhattan_distance(new_position, goal_position) # Get the previous distance

    # Calculate punishment/reward for the aen
    punish_action = int(old_distance < new_distance)
    reward_action = 1 - punish_action

    # Calculate net punishment/reward for the agent
    amount_action = reward_action - punish_action
    return amount_action

def Environment():
    current_state = [[]] # Get the current state from virtual grid

    get_action_from_police = current_state.get_police() # Movement (Left, Right, Up, Down)

    # Reward if nearer to the thief, else punish
    old_state = current_state.get_police() # get the current position
    current_state.move_police(get_action_from_police)
    new_state = current_state.get_police() # get the current position

    thief_state = current_state.get_thief()
    old_distance =  compute_manhathan_distance(old_state, thief_state) # Get the previous distance
    new_distance =  compute_manhathan_distance(new_state, thief_state) # Get the previous distance

    punish_action = int(old_distance < new_distance)
    reward_action = 1 - punish_action

    police_action = reward_action - punish_action
    

