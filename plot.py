import json
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns

def safe_convert(value):
    try:
        return float(value)
    except (ValueError, TypeError):
        print(f"Warning: Non-numeric value encountered: {value}")
        return 0

file_path = 'C:/Users/adity/OneDrive/MyCodes/ProjectActivity/database.json'
try:
    with open(file_path, 'r') as file:
        data = json.load(file)
except FileNotFoundError:
    print(f"Error: File '{file_path}' not found.")
    exit()
except json.JSONDecodeError as e:
    print(f"Error: Failed to parse JSON. {e}")
    exit()

if "users" not in data or not isinstance(data["users"], list):
    print("Error: JSON structure is invalid or 'users' key is missing.")
    exit()

try:
    Aditya = next(user for user in data["users"] if user["name"] == "Aditya")
    other_users = [user for user in data["users"] if user["name"] != "Aditya"]

    Aditya_footprint = {
        "transport": safe_convert(Aditya["carbonFootprint"]["transport"]),
        "energy": safe_convert(Aditya["carbonFootprint"]["energy"]),
        "waste": safe_convert(Aditya["carbonFootprint"]["waste"]),
    }

    avg_footprint = {
        "transport": np.mean([safe_convert(user["carbonFootprint"]["transport"]) for user in other_users]),
        "energy": np.mean([safe_convert(user["carbonFootprint"]["energy"]) for user in other_users]),
        "waste": np.mean([safe_convert(user["carbonFootprint"]["waste"]) for user in other_users]),
    }

    world_standard = {
    "transport": 2400,
    "energy": 3000, 
    "waste": 500  
    }

except KeyError as e:
    print(f"Error: Missing key in the JSON structure. {e}")
    exit()

try:
    categories = ["Transport", "Energy", "Waste"]
    Aditya_data = [Aditya_footprint[cat.lower()] for cat in categories]
    avg_data = [avg_footprint[cat.lower()] for cat in categories]
    world_data = [world_standard[cat.lower()] for cat in categories]

    x = np.arange(len(categories))
    width = 0.25

    plt.figure(figsize=(10, 6))
    plt.bar(x - width, avg_data, width, label='Average of Others', color='green')
    plt.bar(x, Aditya_data, width, label='You (Aditya)', color='blue')
    plt.bar(x + width, world_data, width, label='World Standard', color='orange')

    plt.xlabel('Categories', fontsize=14)
    plt.ylabel('Carbon Footprint (kg CO₂)', fontsize=14)
    plt.title('Carbon Footprint Comparison', fontsize=16)
    plt.xticks(x, categories, fontsize=12)
    plt.legend()

    plt.tight_layout()
    plt.show()

except Exception as e:
    print(f"Error while plotting bar chart: {e}")
    exit()

# Pie Chart
try:
    plt.figure(figsize=(8, 8))
    plt.pie(Aditya_data, labels=categories, autopct='%1.1f%%', colors=['green', 'blue', 'orange'])
    plt.title(f"Carbon Footprint Distribution - Aditya")
    plt.show()
except Exception as e:
    print(f"Error while plotting pie chart: {e}")
    exit()

# Line Chart - Trends Across Users
try:
    user_names = [user["name"] for user in other_users]
    transport_data = [safe_convert(user["carbonFootprint"]["transport"]) for user in other_users]
    energy_data = [safe_convert(user["carbonFootprint"]["energy"]) for user in other_users]
    waste_data = [safe_convert(user["carbonFootprint"]["waste"]) for user in other_users]

    plt.figure(figsize=(12, 6))
    plt.plot(user_names, transport_data, label='Transport', color='green', marker='o')
    plt.plot(user_names, energy_data, label='Energy', color='blue', marker='o')
    plt.plot(user_names, waste_data, label='Waste', color='red', marker='o')

    plt.xlabel('Users', fontsize=14)
    plt.ylabel('Carbon Footprint (kg CO₂)', fontsize=14)
    plt.title('Carbon Footprint Trends Across Users', fontsize=16)
    plt.xticks(rotation=45, ha='right', fontsize=12)
    plt.legend()

    plt.tight_layout()
    plt.show()

except Exception as e:
    print(f"Error while plotting line chart: {e}")
    exit()

# Scatter Plot
try:
    energy_values = [safe_convert(user["carbonFootprint"]["energy"]) for user in other_users]
    transport_values = [safe_convert(user["carbonFootprint"]["transport"]) for user in other_users]

    plt.figure(figsize=(8, 8))
    plt.scatter(energy_values, transport_values, color='purple')
    plt.xlabel('Energy (kg CO₂)', fontsize=14)
    plt.ylabel('Transport (kg CO₂)', fontsize=14)
    plt.title('Energy vs. Transport Correlation', fontsize=16)

    plt.tight_layout()
    plt.show()

except Exception as e:
    print(f"Error while plotting scatter plot: {e}")
    exit()

# Stacked Bar Chart
try:
    total_aditya = np.sum(Aditya_data)
    total_avg = np.sum(avg_data)
    total_world = np.sum(world_data)

    labels = ["Aditya", "Average of Others", "World Standard"]
    values = [total_aditya, total_avg, total_world]

    plt.figure(figsize=(10, 6))
    plt.bar(labels, values, color=['blue', 'green', 'orange'])
    plt.xlabel('Users')
    plt.ylabel('Total Carbon Footprint (kg CO₂)')
    plt.title('Total Carbon Footprint Comparison')

    plt.tight_layout()
    plt.show()

except Exception as e:
    print(f"Error while plotting stacked bar chart: {e}")
    exit()

# Histogram
try:
    transport_all_users = [safe_convert(user["carbonFootprint"]["transport"]) for user in data["users"]]
    plt.figure(figsize=(10, 6))
    plt.hist(transport_all_users, bins=10, color='green', alpha=0.7)
    plt.xlabel('Transport Carbon Footprint (kg CO₂)')
    plt.ylabel('Frequency')
    plt.title('Distribution of Transport Carbon Footprint Across All Users')

    plt.tight_layout()
    plt.show()

except Exception as e:
    print(f"Error while plotting histogram: {e}")
    exit()

# Box Plot
try:
    energy_all_users = [safe_convert(user["carbonFootprint"]["energy"]) for user in data["users"]]
    plt.figure(figsize=(10, 6))
    plt.boxplot(energy_all_users, vert=False, patch_artist=True, boxprops=dict(facecolor='blue', color='blue'))
    plt.xlabel('Energy Carbon Footprint (kg CO₂)')
    plt.title('Spread of Energy Footprint Across All Users')

    plt.tight_layout()
    plt.show()

except Exception as e:
    print(f"Error while plotting box plot: {e}")
    exit()

# Radar Chart
try:
    labels = ['Transport', 'Energy', 'Waste']
    aditya_values = Aditya_data
    world_values = world_data

    angles = np.linspace(0, 2 * np.pi, len(labels), endpoint=False).tolist()
    aditya_values += aditya_values[:1]
    world_values += world_values[:1]
    angles += angles[:1]

    plt.figure(figsize=(8, 8))
    ax = plt.subplot(111, polar=True)
    ax.plot(angles, aditya_values, color='blue', label='Aditya', linewidth=2)
    ax.plot(angles, world_values, color='orange', label='World Standard', linewidth=2)
    ax.fill(angles, aditya_values, color='blue', alpha=0.3)
    ax.fill(angles, world_values, color='orange', alpha=0.3)

    ax.set_yticklabels([])
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(labels)
    plt.title('Aditya vs World Standard (Radar Chart)')
    plt.legend(loc='upper right')

    plt.tight_layout()
    plt.show()

except Exception as e:
    print(f"Error while plotting radar chart: {e}")
    exit()
