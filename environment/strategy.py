# Strategies for: Rewards, Punishment
# Actions: Possiblities

'''
0000000000000000000000000000000 -z
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
0000000000000000000000000000000 +z
-x                            +x
'''

from typing import Tuple
import request
import numpy as np

URL_ENVIRONMENT = 'localhost:5001'

class Agent:
    def __init__(self, x, y, type_agent) -> None:
        self.x = x
        self.y = y
        self.type_agent = type_agent
        self.done = False
    
    def position(self):
        return (self.x, self.y)

    
    def action(self, move):
        # agent.moveHorizontal(-1 || 1)
        # agent.moveVertical(-1 || 1)
        move_vertical, move_horizontal = move
        # Move agent (visually)
        # ...

        response_json = request.get(f'{URL_ENVIRONMENT}/move?move_vertical={move_vertical}&move_horizontal={move_horizontal}')

        self.x = response_json['x']
        self.y = response_json['y']

class Environment:
    police: Agent
    thief: Agent
    goal: Tuple
    max_steps: int
    current_step: int

    def __init__(self, police, thief, goal, max_steps = 200) -> None:
        self.police = police
        self.thief = thief
        self.goal = goal
        self.max_steps = max_steps
        self.current_step = 0
        
    def reset(self):
        """
        Restart the maze with the police and Thief at the beging and return the position for the police, thief and goal
        {
            "police": {"x": x, "y": y},
            "thief": {"x": x, "y": y},
            "goal": {"x": x, "y": y}
        }
        """
        response_json = request.get(f'{URL_ENVIRONMENT}/reset')

        police_position = response_json['police']
        self.police.x = police_position['x']
        self.police.y = police_position['y']

        thief_position = response_json['thief']
        self.thief.x = thief_position['x']
        self.thief.y = thief_position['y']

        goal_position = response_json['goal']
        self.goal = goal_position['x'], goal_position['y']

    def thief_police_same_position(self):
        return self.police.position == self.thief.position
    
    def thief_reach_goal(self):
        return self.thief.position == self.goal_position

    def step_thief(self, action):
        reward = -1
        self.thief.step(action)
        thief_police_same_position = self.thief_police_same_position()
        thief_reach_goal = self.thief_reach_goal()

        observations = (self.police, self.thief)
        done = thief_police_same_position or thief_reach_goal

        if thief_police_same_position:
            reward = -100
        
        if thief_reach_goal:
            reward = 100

        return observations, reward, done
    
    def step_police(self, action):
        reward = -1
        self.police.step(action)
        thief_police_same_position = self.thief_police_same_position()
        thief_reach_goal = self.thief_reach_goal()

        observations = (self.police, self.thief)
        done = thief_police_same_position or thief_reach_goal

        if thief_police_same_position:
            reward = 100
        
        if thief_reach_goal:
            reward = -100

        return observations, reward, done

    def step(self, agent: Agent, action):
        reward = -1
        agent.step(action)
        observations = (self.police, self.thief)
        done = self.police.position == self.thief.position or self.thief.position == self.goal_position
        return observations, reward, done





def obs_to_state(police: Agent, thief: Agent):
    return police.position, thief.position

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

def train_q_learning(env_, q_table_=None):
    print('Start Q-Learning training:')
    display_freq = iter_max // 10

    # Initialize Q-Table
    if q_table_ is None:
        q_table_ = np.zeros((n_states, n_states, 3))  # [number_of_positions x number_of_speeds x number_of_actionst]

    for i in range(iter_max):
        obs = env_.reset()
        total_reward_ = 0
        ## eta: learning rate is decreased at each step
        eta = max(min_lr, initial_lr * (0.85 ** (i // 100)))

        for j in range(t_max):
            pos, speed = obs_to_state(env_, obs)  # Get action,state to pick from Q-Table

            if np.random.uniform(0, 1) < eps:  # Randomize sometimes
                action = np.random.choice(env_.action_space.n)
            else:
                # Q-Table picking process
                logits = q_table_[pos][speed]  # Actions for
                logits_exp = np.exp(logits)
                probs = logits_exp / np.sum(logits_exp)
                action = np.random.choice(env_.action_space.n, p=probs)

            obs, reward, done, _ = env_.step(action)
            total_reward_ += reward

            # Update Q-Table
            pos_, speed_ = obs_to_state(env_, obs)
            q_table_[pos][speed][action] = q_table_[pos][speed][action] + eta * \
                                           (reward + gamma * np.max(q_table_[pos_][speed_]) - q_table_[pos][speed][action])
            # if j % display_freq == 0:  # Write out partial results
            #     print(f'At round: {j + 1} - Reward last episode: {total_reward_}')
            if done:
                break
        if i % display_freq == 0:  # Write out partial results
            print('At epoch: %d - Reward last episode: %d' % (i + 1, total_reward_))

    print('Training finished!')
    solution_policy = np.argmax(q_table_, axis=2)
    solution_policy_scores = [run_episode(env_, solution_policy, False) for _ in range(100)]
    print("Average score of solution = ", np.mean(solution_policy_scores))

    return solution_policy, q_table_



if __name__ == '__main__':
    iter_max = 10  # Number of epochs = Cuantas veces se va a jugar
    t_max = 2000  # Number of max actions taken per episode. If in 200 steps it's not done, the environment takes it as fail.

    # Tweaking params
    initial_lr = 1.0  # Initial Learning Rate
    min_lr = 0.003  # Minimum Learning Rate
    gamma = 1.0  # Discount factor
    eps = 0.02  # Probability of take a random action

    try:
        q_table = np.load('q_table.npy')
    except Exception as ex:
        q_table = None
    # sol_policy = np.argmax(q_table, axis=2)
    sol_policy, q_table = train_q_learning(q_table)
    np.save('q_table.npy', q_table)
    # Visual things:
    pygame.init()
    screen = pygame.display.set_mode((600, 400))
    # Animate it
    run_episode(env, sol_policy, True)
    

