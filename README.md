# Problem Statement 
Develop a secure, flexible, and high-precision Software-as-a-Service (SaaS) platform that empowers researchers to build and deploy complex behavioral experiments directly in a web browser. The platform's mission is to democratize cognitive science research by providing an accessible, no-code/low-code solution that replicates the accuracy of labbased studies while enabling large-scale, diverse online data collection.

# SOLUTION- CogniLab

## Web-Based Cognitive Experiment Platform

### Core Idea

We are building a web-based SaaS platform that allows researchers to create and conduct cognitive and behavioral experiments directly through a browser.

The platform has two main users:

1. Researchers — who create, configure, publish, and analyze experiments.
2. Participants — who anonymously take published experiments through a browser.

The main goal is to make browser-based behavioral research easier while addressing one of the biggest challenges of web experiments: the reliability of timing and participant/device measurements.

---

# 1. Researcher Flow

A researcher first creates an account and logs into the researcher dashboard.

From the dashboard, the researcher can create a new experiment.

## Creating an Experiment

The researcher provides basic information such as:

* Experiment name
* Description
* Instructions
* Test/trial configuration
* Timing parameters
* Stimuli such as , images, colors, etc.
* Expected responses
* Number/order of trials

An experiment can contain a single test or multiple types of trials/tests.

For example:

```
Experiment: Human Reaction Study

    Trial 1 → Reaction to Red Circle
    Trial 2 → Reaction to Blue Circle
    Trial 3 → Color Matching
    Trial 4 → Memory Response
```

The researcher does not need to write code.

For the hackathon MVP, the experiment builder can be form-based rather than a fully complex drag-and-drop editor.

---

# 2. Draft and Publishing

When the researcher saves an experiment, it initially remains a draft.

```
DRAFT
   ↓
Researcher reviews experiment
   ↓
PUBLISH
   ↓
Experiment becomes available to participants
```

Once published, the system generates a unique experiment link.

Example:

```
/experiment/a8f3k2
```

The researcher can share this link with participants.

---

# 3. Participant Flow

A participant opens the experiment link.

The participant does not need to provide their real identity.

Instead, the system creates an anonymous participant/session ID.

Example:

```
Participant ID: P-7X92K
```

The participant first sees the experiment instructions.

Before the actual experiment starts, the platform performs a browser/device compatibility and calibration check.

---

# 4. Browser Reliability / Calibration

This is one of the main differentiating features of our platform.

Browser-based experiments have a major problem:

Different devices and browsers can have different timing behavior.

For example:

* Different display refresh rates
* Frame rendering delays
* Browser performance differences
* Input/keyboard latency
* Temporary frame drops
* Device performance differences

Therefore, before the experiment begins, the platform performs a short calibration process.

The system collects relevant browser/device timing information and generates a session-level reliability score.

Example:

```
Browser Reliability

Score: 93/100

Display stability:      Good
Frame consistency:      Good
Input responsiveness:   Good
Timing stability:       Good
```

The reliability score is associated with that participant's experiment session.

---

# 5. Experiment Execution

After calibration, the participant begins the actual experiment.

The platform controls the presentation of each stimulus and records the participant's response.

Example:

```
Fixation Cross
      ↓
Wait 500 ms
      ↓
Red Circle appears
      ↓
Participant presses Space
      ↓
Reaction time calculated
      ↓
Next trial
```

Example measurement:

```
Stimulus displayed: 500 ms
Response detected:  743 ms

Reaction time = 243 ms
```

The platform should use high-resolution browser timing mechanisms and carefully control stimulus presentation to obtain as accurate a measurement as possible in a web environment.

---

# 6. Raw and Reliability-Aware Measurements

The platform should always preserve the original/raw measurement.

For example:

```
Raw reaction time: 247 ms
Reliability score: 93/100
```

The system can additionally generate a reliability-aware or quality-adjusted reading where appropriate.

For example:

```
Raw reading:              247 ms
Quality-adjusted reading: 251 ms
Reliability:               93/100
```

The raw measurement should never be overwritten.

This allows researchers to see both the original browser measurement and the platform's reliability-aware interpretation.

---

# 7. Participant Results

After completing the experiment, the participant can see their own results.

For example:

```
Experiment Completed

Average Reaction Time: 247 ms
Accuracy: 92%

Session Reliability: 93/100

Trials Completed: 20/20
```

The participant's personal identity is not exposed to the researcher.

---

# 8. Researcher Results Dashboard

The researcher can return to their dashboard and see all completed experiment sessions.

Participants remain anonymous.

Example:

```
Experiment: Human Reaction Study

Participants: 84

Average Reaction Time: 247 ms
Median Reaction Time: 241 ms
Average Accuracy: 91%

High Reliability Sessions: 72
Medium Reliability:        9
Low Reliability:           3
```

The researcher can inspect individual anonymous sessions.

Example:

```
Participant P-7X92K

Reliability: 93/100

Trial 1 → 243 ms → Correct
Trial 2 → 281 ms → Correct
Trial 3 → 198 ms → Incorrect
Trial 4 → 252 ms → Correct
```

The researcher can also see raw and reliability-aware measurements where applicable.

---

# 9. Low-Reliability Sessions

The platform can flag sessions where browser/device timing appears unreliable.

Example:

```
Participant P-4A82M

Reliability: 54/100

⚠ Timing instability detected

Researcher may choose to:
- Include the data
- Exclude the session from analysis
- Inspect the raw readings
```

The platform should not silently delete or modify participant data.

---

# 10. Experiment Lifecycle

The overall experiment lifecycle is:

```
Researcher Login
       ↓
Create Experiment
       ↓
Save as Draft
       ↓
Configure Tests/Trials
       ↓
Publish
       ↓
Generate Shareable Link
       ↓
Participant Opens Link
       ↓
Anonymous Session Created
       ↓
Browser Calibration
       ↓
Reliability Score Generated
       ↓
Experiment Begins
       ↓
Stimuli Presented
       ↓
Responses Recorded
       ↓
Raw Reaction Times Stored
       ↓
Reliability-Aware Analysis
       ↓
Participant Sees Results
       ↓
Researcher Sees Anonymous Results
```

---

# 11. Core Data Model

The main entities can be:

```
Users
  ↓
Experiments
  ↓
Trials

Experiments
  ↓
Participant Sessions
  ↓
Responses
```

Conceptually:

```
User
 └── Experiments
       ├── Trial 1
       ├── Trial 2
       ├── Trial 3
       └── Participant Sessions
              ├── Response 1
              ├── Response 2
              └── Response 3
```

Important information stored for a participant session can include:

```
anonymous participant ID
experiment ID
reliability score
browser/device calibration information
start time
completion time
```

Each response can contain:

```
trial ID
stimulus
response
reaction time
correct/incorrect
timestamp
```

---

# 12. Main Features for the Hackathon MVP

Because the hackathon is only 6 hours, the MVP should focus on a complete working flow.

### Researcher

* Registration/login
* Create experiment
* Add trials/tests
* Save experiment
* Publish experiment
* Generate participant link
* View experiment results

### Participant

* Open experiment link
* Anonymous session creation
* Browser calibration
* Reliability score
* Complete experiment
* Reaction-time measurement
* View results

### Analytics

* Participant count
* Average reaction time
* Median reaction time
* Accuracy
* Reliability scores
* Individual anonymous sessions
* Raw measurements
* Reliability-aware measurements
* Low-reliability session flags

---

# 13. Main Differentiating Feature

The key feature of the platform is:

## Browser Reliability + Precision-Aware Research

Instead of treating every browser measurement as equally reliable, the platform first evaluates the participant's environment.

The researcher therefore receives not just:

```
Participant → 247 ms
```

but:

```
Participant P-7X92K

Raw reaction time: 247 ms
Reliability: 93/100
Quality-aware reading: 251 ms
```

This directly addresses the problem of conducting high-precision behavioral experiments on the web.

---

# 14. Product Vision

The long-term vision is to become a browser-based alternative to traditional cognitive experiment software.

Future versions could support:

* Drag-and-drop experiment builder
* Conditional branching
* Advanced randomization
* More experiment types
* Experiment templates
* Adaptive experiments
* Advanced statistical analysis
* Exporting research datasets
* Collaboration between researchers
* More detailed device/browser calibration
* Privacy and consent management
* Research ethics workflows

For the hackathon, however, the focus is on proving the core concept with a polished end-to-end working experiment.
A 
