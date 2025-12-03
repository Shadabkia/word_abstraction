This is **Miyamoto Miyazaki**.

Here is the technical specification for the **`LevelAnalyzer`** module. This specification is designed to be handed directly to a gameplay programmer for implementation.

It distinguishes between **State Metrics** (current snapshot) and **Graph Metrics** (logic flow).

-----

## Method Specification: `calculate_level_complexity(level_json)`

### **Input**

  * `level_json`: A standard Level Object containing:
      * `grid`: 2D array of Tile IDs (Initial State).
      * `matches`: List of Rule Objects (Name, Members, Action, Reveals).

### **Output**

  * `ComplexityReport`: A JSON object containing 4 primitive metrics and 2 composite scores.

-----

### **Metric 1: Spatial Scatter ($S_{visual}$)**

**Definition:** Measures **Visual Load**. How scattered are the members of a group across the grid? A group clumped together is easy to see; a group spread across four corners is hard.

**The Math:** Sum of Manhattan Distances between all distinct pairs of tiles in a target group.
$$D(p_1, p_2) = |r_1 - r_2| + |c_1 - c_2|$$

**The Algorithm:**

1.  Identify all **Available Groups** (groups where all 4 `members` exist in the current `grid`).
2.  For each group:
      * Locate coordinates $(r, c)$ for all 4 tiles.
      * Calculate distances for all 6 unique pairs (AB, AC, AD, BC, BD, CD).
      * Sum these distances.
3.  **Result:** Average the sum across all Available Groups.

-----

### **Metric 2: Mechanical Entry Cost ($E_{mech}$)**

**Definition:** Measures **Physical Effort**. What is the minimum number of swaps required to lock the *easiest* available row? This determines if the level starts "Fast" or "Slow".

**The Math:**
$$Cost_{group} = 4 - \max(\text{count of members in Row}_0, \text{Row}_1, \dots, \text{Row}_N)$$
*(i.e., If Row 2 already has 3 members of the group, cost is 1 swap.)*

**The Algorithm:**

1.  Identify all **Available Groups**.
2.  For each group:
      * Count how many of its members currently sit in Row 0, Row 1, etc.
      * Find the row with the highest count.
      * Calculate swaps needed to fill that row ($4 - count$).
3.  **Result:** The **Minimum** value found (because players naturally optimize for the easiest move).

-----

### **Metric 3: Dependency Depth ($D_{logic}$)**

**Definition:** Measures **Logical Load**. How many layers of "unlocking" are required? This ignores the grid and analyzes the rule dependencies.

**The Math:** Longest Path in a Directed Acyclic Graph (DAG).

**The Algorithm:**

1.  **Build Nodes:** Create a node for every Rule ID in `matches`.
2.  **Build Edges:**
      * Iterate through all Rules ($R_{source}$).
      * If $R_{source}$ is a `transform`, look at its `reveals` list.
      * Find any other Rule ($R_{target}$) that lists those revealed tiles in its `members`.
      * Create Edge: $R_{source} \rightarrow R_{target}$.
3.  **Traverse:** Perform a BFS/DFS to find the **Longest Path** from any start node (Initial Group) to any leaf node (Final Group).
4.  **Result:** Integer length of that path (e.g., 0, 1, 2...).

-----

### **Metric 4: Volatility Index ($V_{chaos}$)**

**Definition:** Measures **Adaptation Load**. How unstable is the board? High volatility forces the player to constantly rebuild their mental map.

**The Algorithm:**

1.  Count total number of rules where `action == "transform"`.
2.  **Result:** Integer count.

-----

## **Composite Scores (The Final Output)**

We combine the primitives above to answer your two specific questions: "Length" and "Complexity".

### **1. Estimated Length ($L_{est}$)**

*What is the minimum number of actions to win?*

$$L_{est} = E_{mech} + (V_{chaos} \times 4) + (N_{static\_groups} \times 1)$$

  * **Logic:**
      * Start with the swaps needed to break the first lock ($E_{mech}$).
      * Each Transform adds roughly 4 "setup" moves to gather the ingredients.
      * Each Static group adds roughly 1 "cleanup" move.

### **2. Structural Complexity ($C_{struct}$)**

*How hard does the brain have to work?*

$$C_{struct} = (S_{visual} \times 0.5) + (D_{logic} \times 2.0) + (V_{chaos} \times 1.5)$$

  * **Logic:**
      * **Scatter ($S_{visual}$)** is a nuisance, so it gets a low weight (0.5).
      * **Logic ($D_{logic}$)** is the hardest cognitive task (planning), so it gets high weight (2.0).
      * **Volatility ($V_{chaos}$)** disrupts memory, weighted medium (1.5).

-----

## **Pseudocode Implementation**

```python
class ComplexityReport:
    def __init__(self, level):
        self.grid = level.grid
        self.matches = level.matches
        
    def generate(self):
        # 1. Identify what is currently on the board
        current_tiles = flatten(self.grid)
        available_groups = [g for g in self.matches if is_subset(g.members, current_tiles)]
        
        # --- PRIMITIVE METRICS ---
        
        # Metric 1: Scatter
        scatter_scores = []
        for g in available_groups:
            coords = get_coordinates(g.members, self.grid)
            # Sum of Manhattan distances between all 6 pairs
            dist = sum(manhattan(p1, p2) for p1, p2 in combinations(coords, 2))
            scatter_scores.append(dist)
        avg_scatter = mean(scatter_scores) if scatter_scores else 0
        
        # Metric 2: Entry Cost
        swap_costs = []
        for g in available_groups:
            # How many members are in the "best" row for this group?
            max_in_row = get_max_members_in_any_row(g.members, self.grid)
            swap_costs.append(4 - max_in_row)
        entry_cost = min(swap_costs) if swap_costs else 0
        
        # Metric 3: Dependency Depth
        graph = build_dependency_graph(self.matches)
        depth = get_longest_path(graph)
        
        # Metric 4: Volatility
        volatility = count(g for g in self.matches if g.action == 'transform')
        
        # --- COMPOSITE SCORES ---
        
        static_groups = len(self.matches) - volatility
        
        estimated_length = entry_cost + (volatility * 4) + static_groups
        
        complexity_score = (avg_scatter * 0.5) + (depth * 2.0) + (volatility * 1.5)
        
        return {
            "metrics": {
                "spatial_scatter": avg_scatter,
                "mechanical_entry_cost": entry_cost,
                "dependency_depth": depth,
                "volatility": volatility
            },
            "final_rating": {
                "estimated_moves": estimated_length,
                "complexity_rating": complexity_score
            }
        }
```