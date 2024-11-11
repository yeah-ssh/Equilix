

import pandas as pd
import numpy as np
import re
import matplotlib.pyplot as plt
import seaborn as sns
import pickle
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, classification_report, accuracy_score, precision_score, recall_score, f1_score 

from sklearn.naive_bayes import GaussianNB
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC

# Read the CSV file
dataset = pd.read_csv('data.csv',delimiter='\t')

# Display the first few rows of the DataFrame

pattern = r'^Q\d+A$'
scale_column = [column for column in dataset.columns if re.match(pattern, column)]
# Create a new DataFrame with the extracted columns
extracted_data = dataset[scale_column]

#Subtract 1 from all the response to change the scale from 1 to 4 to 0 to 3
def sub(data):
    return data.subtract(1,axis=1)
regularized_dataset=sub(extracted_data) 

# Declare the question key to generate the dataset for each dataset
DASS_keys = {'Depression': [3, 5, 10, 13, 16, 17, 21],
             'Anxiety': [2, 4, 7, 9, 15, 19, 20],
             'Stress': [1, 6, 8, 11, 12, 14, 18,]}
Depression_keys = []
for i in DASS_keys["Depression"]:
    Depression_keys.append('Q'+str(i)+'A')
Stress_keys = []
for i in DASS_keys["Stress"]:
    Stress_keys.append('Q'+str(i)+'A')
Anxiety_keys = []
for i in DASS_keys["Anxiety"]:
    Anxiety_keys.append('Q'+str(i)+'A')
depression_dataset= regularized_dataset.filter(Depression_keys)
stress_dataset = regularized_dataset.filter(Stress_keys)
anxiety_dataset = regularized_dataset.filter(Anxiety_keys)


def scores(data):
    col=list(data)
    data['Total_Count']=data[col].sum(axis=1)
    return data
depression_dataset=scores(depression_dataset)
stress_dataset=scores(stress_dataset)
anxiety_dataset=scores(anxiety_dataset)

# Declaring function to assign the label for DASS-21 Depression subscale
def condition(x):
    if x <= 4:
        return 'Normal'
    elif 5 <= x <= 6:
        return 'Mild'
    elif 7 <= x <= 10:
        return 'Moderate'
    elif 11 <= x <= 13:
        return 'Severe'
    elif x >= 14:
        return 'Extremely Severe'

# Apply the condition and drop the "Total_Count" column
depression_dataset['Label'] = depression_dataset['Total_Count'].apply(condition)
final_depression_dataset = depression_dataset.drop(columns=['Total_Count'])
print(final_depression_dataset)

# Define the desired label arrangement
desired_labels = ['Extremely Severe', 'Severe', 'Moderate', 'Mild', 'Normal']

# Count the frequency of each label
label_counts = final_depression_dataset['Label'].value_counts()
print(label_counts.reindex(desired_labels))

# Define the colors for each bar
colors = ['skyblue', 'green', 'yellow', 'orange', 'gray']

# Reorder the label counts based on the desired arrangement
label_counts_ordered = label_counts.reindex(desired_labels)

# Plot the bar chart
plt.bar(label_counts_ordered.index, label_counts_ordered.values, color=colors)

# Plot the bar chart
# plt.bar(label_counts.index, label_counts.values, color=colors)

# Add labels and title
plt.xlabel('Label')
plt.ylabel('Frequency')
plt.title('Depression Dataset Distribution of Labels')

def condition(x):
    if x <= 7:
        return 'Normal'
    elif 8 <= x <= 9:
        return 'Mild'
    elif 10 <= x <= 12:
        return 'Moderate'
    elif 13 <= x <= 16:
        return 'Severe'
    elif x >= 17:
        return 'Extremely Severe'

# Apply the condition and drop the "Total_Count" column
stress_dataset['Label'] = stress_dataset['Total_Count'].apply(condition)
final_stress_dataset = stress_dataset.drop(columns=['Total_Count'])
desired_labels = ['Extremely Severe', 'Severe', 'Moderate', 'Mild', 'Normal']

# Count the frequency of each label
label_counts = final_stress_dataset['Label'].value_counts()
print(label_counts.reindex(desired_labels))

# Define the colors for each bar
colors = ['skyblue', 'green', 'yellow', 'orange', 'gray']

# Reorder the label counts based on the desired arrangement
label_counts_ordered = label_counts.reindex(desired_labels)

# Plot the bar chart
plt.bar(label_counts_ordered.index, label_counts_ordered.values, color=colors)

# Add labels and title
plt.xlabel('Label')
plt.ylabel('Frequency')
plt.title('Stress Dataset Distribution of Labels')

# Declaring function to assign the label for DASS-21 Anxiety subscale
def condition(x):
    if x <= 3:
        return 'Normal'
    elif 4 <= x <= 5:
        return 'Mild'
    elif 6 <= x <= 7:
        return 'Moderate'
    elif 8 <= x <= 9:
        return 'Severe'
    elif x >= 10:
        return 'Extremely Severe'

# Apply the condition and drop the "Total_Count" column
anxiety_dataset['Label'] = anxiety_dataset['Total_Count'].apply(condition)
final_anxiety_dataset = anxiety_dataset.drop(columns=['Total_Count'])
print(final_anxiety_dataset)

# Define the desired label arrangement
desired_labels = ['Extremely Severe', 'Severe', 'Moderate', 'Mild', 'Normal']

# Count the frequency of each label
label_counts = final_anxiety_dataset['Label'].value_counts()
print(label_counts.reindex(desired_labels))

# Define the colors for each bar
colors = ['skyblue', 'green', 'yellow', 'orange', 'gray']

# Reorder the label counts based on the desired arrangement
label_counts_ordered = label_counts.reindex(desired_labels)

# Plot the bar chart
plt.bar(label_counts_ordered.index, label_counts_ordered.values, color=colors)

# Add labels and title
plt.xlabel('Label')
plt.ylabel('Frequency')
plt.title('Anxiety Dataset Distribution of Labels')

depression_labels = final_depression_dataset["Label"]
depression_X = final_depression_dataset.drop(columns=["Label"])


#Encode the labels 
encoder = LabelEncoder()
encoded_depression_label = encoder.fit_transform(depression_labels)

# Define the desired label values
desired_label_values = ['Extremely Severe', 'Severe', 'Moderate', 'Mild', 'Normal']
encoder.classes_ = desired_label_values
dict(zip(encoder.classes_,range(len(encoder.classes_))))


#Get the training and test set from the depression dataset
dp_X_Train, dp_X_Test, dp_Y_Train, dp_Y_Test = train_test_split(depression_X, encoded_depression_label, test_size=0.3, random_state= 30)

# Calculate the count of each unique label
unique_labels, label_counts = np.unique(dp_Y_Test, return_counts=True)
# Define the desired label arrangement
desired_labels = ['Extremely Severe', 'Severe', 'Moderate', 'Mild', 'Normal']

print("Test data distribution")
# Print the label counts
for label, count in zip(unique_labels, label_counts):
    print(f"Label: {label}, Count: {count}")
# Calculate the count of each unique label
unique_labels, label_counts = np.unique(dp_Y_Train, return_counts=True)
# Define the desired label arrangement
desired_labels = ['Extremely Severe', 'Severe', 'Moderate', 'Mild', 'Normal']

print("Training data distribution")
# Print the label counts
for label, count in zip(unique_labels, label_counts):
    print(f"Label: {label}, Count: {count}")


#Seperate the data and labels
stress_labels = final_stress_dataset["Label"]
stress_X = final_stress_dataset.drop(columns=["Label"])
encoder = LabelEncoder()
encoded_stress_label = encoder.fit_transform(stress_labels)

# Define the desired label values
desired_label_values = ['Extremely Severe', 'Severe', 'Moderate', 'Mild', 'Normal']
encoder.classes_ = desired_label_values
dict(zip(encoder.classes_,range(len(encoder.classes_))))
#Get the training and test set from the stress dataset
st_X_Train, st_X_Test, st_Y_Train, st_Y_Test = train_test_split(stress_X, encoded_stress_label, test_size=0.3, random_state= 30)
# Calculate the count of each unique label
unique_labels, label_counts = np.unique(st_Y_Test, return_counts=True)
# Define the desired label arrangement
desired_labels = ['Extremely Severe', 'Severe', 'Moderate', 'Mild', 'Normal']

print("Test data distribution")
# Print the label counts
for label, count in zip(unique_labels, label_counts):
    print(f"Label: {label}, Count: {count}")

# Calculate the count of each unique label
unique_labels, label_counts = np.unique(st_Y_Train, return_counts=True)
# Define the desired label arrangement
desired_labels = ['Extremely Severe', 'Severe', 'Moderate', 'Mild', 'Normal']

print("Training data distribution")
# Print the label counts
for label, count in zip(unique_labels, label_counts):
    print(f"Label: {label}, Count: {count}")


#Seperate the data and labels
anxiety_labels = final_anxiety_dataset["Label"]
anxiety_X = final_anxiety_dataset.drop(columns=["Label"])
#Encode the labels 
encoder = LabelEncoder()
encoded_anxiety_label = encoder.fit_transform(anxiety_labels)

# Define the desired label values
desired_label_values = ['Extremely Severe', 'Severe', 'Moderate', 'Mild', 'Normal']
encoder.classes_ = desired_label_values
dict(zip(encoder.classes_,range(len(encoder.classes_))))
#Get the training and test set from the stress dataset
ax_X_Train, ax_X_Test, ax_Y_Train, ax_Y_Test = train_test_split(anxiety_X, encoded_anxiety_label, test_size=0.3, random_state= 30)

# Calculate the count of each unique label
unique_labels, label_counts = np.unique(ax_Y_Test, return_counts=True)
# Define the desired label arrangement
desired_labels = ['Extremely Severe', 'Severe', 'Moderate', 'Mild', 'Normal']

print("Test data distribution")
# Print the label counts
for label, count in zip(unique_labels, label_counts):
    print(f"Label: {label}, Count: {count}")
# Calculate the count of each unique label
unique_labels, label_counts = np.unique(ax_Y_Train, return_counts=True)
# Define the desired label arrangement
desired_labels = ['Extremely Severe', 'Severe', 'Moderate', 'Mild', 'Normal']

print("Training data distribution")
# Print the label counts
for label, count in zip(unique_labels, label_counts):
 print(f"Label: {label}, Count: {count}") 





#Training the model on depression dataset
k_model = KNeighborsClassifier(n_neighbors=10)
k_model.fit(dp_X_Train, dp_Y_Train) 
dp_predictions = k_model.predict(dp_X_Test)   

#Confusion matrix
cm = confusion_matrix(dp_Y_Test, dp_predictions)

import seaborn as sns

#Setting the labels
labels = ['Extremely Severe', 'Severe', 'Moderate', 'Mild', 'Normal']

#Plot the Confusion matrix graph
fig= plt.figure(figsize=(8, 5))
ax = plt.subplot()
sns.heatmap(cm, annot=True, ax = ax, fmt='g')
ax.set_xlabel('Predicted Labels', fontsize=10)
ax.xaxis.set_label_position('bottom')
plt.xticks(rotation=90)
ax.xaxis.set_ticklabels(labels, fontsize = 5)
ax.xaxis.tick_bottom()

ax.set_ylabel('True Labels', fontsize=10)
ax.yaxis.set_ticklabels(labels, fontsize = 10)
plt.yticks(rotation=0)

plt.title('Confusion Matrix', fontsize=15)
#Classification report
print(classification_report(dp_Y_Test, dp_predictions, target_names = ['Extremely Severe(0)', 'Severe(1)', 'Moderate(2)', 'Mild(3)', 'Normal(4)']))

accuracy = accuracy_score(dp_Y_Test, dp_predictions)
precision = precision_score(dp_Y_Test, dp_predictions, average='macro')
recall = recall_score(dp_Y_Test, dp_predictions, average='macro')
f1 = f1_score(dp_Y_Test, dp_predictions, average='macro')


with open('knn_depression.pkl', 'wb') as file:
    pickle.dump(k_model, file)




k_model_st = KNeighborsClassifier(n_neighbors=10)
k_model_st.fit(st_X_Train, st_Y_Train)

st_predictions = k_model_st.predict(st_X_Test)

cm_st = confusion_matrix(st_Y_Test, st_predictions)


import seaborn as sns

#Setting the labels
labels = ['Extremely Severe', 'Severe', 'Moderate', 'Mild', 'Normal']

#Plot the Confusion matrix graph
fig= plt.figure(figsize=(8, 5))
ax = plt.subplot()
sns.heatmap(cm_st, annot=True, ax = ax, fmt='g')
ax.set_xlabel('Predicted Labels', fontsize=10)
ax.xaxis.set_label_position('bottom')
plt.xticks(rotation=90)
ax.xaxis.set_ticklabels(labels, fontsize = 5)
ax.xaxis.tick_bottom()

ax.set_ylabel('True Labels', fontsize=10)
ax.yaxis.set_ticklabels(labels, fontsize = 10)
plt.yticks(rotation=0)

plt.title('Confusion Matrix', fontsize=15)

print(classification_report(st_Y_Test, st_predictions, target_names = ['Extremely Severe(0)', 'Severe(1)', 'Moderate(2)', 'Mild(3)', 'Normal(4)']))
accuracy = accuracy_score(st_Y_Test, st_predictions)
precision = precision_score(st_Y_Test, st_predictions, average='macro')
recall = recall_score(st_Y_Test, st_predictions, average='macro')
f1 = f1_score(st_Y_Test, st_predictions, average='macro')


with open('knn_stress.pkl', 'wb') as file:
    pickle.dump(k_model_st, file)




k_model_ax = KNeighborsClassifier(n_neighbors=10)
k_model_ax.fit(ax_X_Train, ax_Y_Train)

ax_predictions = k_model_ax.predict(ax_X_Test)

cm_ax = confusion_matrix(ax_Y_Test, ax_predictions)


import seaborn as sns

#Setting the labels
labels = ['Extremely Severe', 'Severe', 'Moderate', 'Mild', 'Normal']

#Plot the Confusion matrix graph
fig= plt.figure(figsize=(8, 5))
ax = plt.subplot()
sns.heatmap(cm_ax, annot=True, ax = ax, fmt='g')
ax.set_xlabel('Predicted Labels', fontsize=10)
ax.xaxis.set_label_position('bottom')
plt.xticks(rotation=90)
ax.xaxis.set_ticklabels(labels, fontsize = 5)
ax.xaxis.tick_bottom()

ax.set_ylabel('True Labels', fontsize=10)
ax.yaxis.set_ticklabels(labels, fontsize = 10)
plt.yticks(rotation=0)

plt.title('Confusion Matrix', fontsize=15)

print(classification_report(ax_Y_Test, ax_predictions, target_names = ['Extremely Severe(0)', 'Severe(1)', 'Moderate(2)', 'Mild(3)', 'Normal(4)']))
accuracy = accuracy_score(ax_Y_Test, ax_predictions)
precision = precision_score(ax_Y_Test, ax_predictions, average='macro')
recall = recall_score(ax_Y_Test, ax_predictions, average='macro')
f1 = f1_score(ax_Y_Test, ax_predictions, average='macro')


with open('knn_anxiety.pkl', 'wb') as file:
    pickle.dump(k_model_ax, file)
