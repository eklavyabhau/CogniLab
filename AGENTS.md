You are helping me build the BACKEND for a 6-hour web-development hackathon project.

I am the backend developer in a 4-member team. The problem statement is:

"Build a secure, flexible, high-precision Software-as-a-Service platform that allows researchers to create and deploy behavioral/cognitive experiments through a web browser. The platform should enable researchers to collect large-scale participant data while addressing the difficulty of obtaining reliable millisecond-sensitive measurements on the web."

Do NOT over-engineer this. We have only 6 hours. The priority is:

1. Working end-to-end MVP
2. Clean backend architecture
3. Strong demo
4. One technically meaningful differentiating feature
5. Ability to explain every architectural decision to judges

Do not introduce unnecessary technologies.

---

# 1. MAIN PRODUCT IDEA

We are building a web-based cognitive/behavioral experiment platform.

There are two main users:

### Researcher

The researcher:

* Registers/logs in
* Creates an experiment
* Configures one or more tests/trials
* Saves the experiment as a draft
* Publishes the experiment
* Gets a unique shareable experiment link
* Views anonymous participant results
* Views reaction times, accuracy, reliability information, and analytics

### Participant

The participant:

* Opens the experiment through a shareable link
* Does NOT need to create an account
* Gets an anonymous participant/session ID
* Goes through browser/device compatibility and calibration checks
* Receives a reliability score
* Performs the experiment
* The browser records stimulus/response timing
* Raw reaction times and responses are collected
* Participant sees their result after completing the experiment
* Researcher receives the anonymous results

---

# 2. CORE USER FLOW

The complete flow should be:

Researcher:

Login
↓
Create Experiment
↓
Configure Tests/Trials
↓
Save as Draft
↓
Publish
↓
Generate Shareable Link
↓
Wait for participants

Participant:

Open Experiment Link
↓
Anonymous Session Created
↓
Browser Calibration / Compatibility Check
↓
Reliability Score Generated
↓
Experiment Starts
↓
Stimulus Presented
↓
Participant Responds
↓
Reaction Time Recorded
↓
Next Trial
↓
Experiment Completed
↓
Participant sees result
↓
Researcher sees anonymous result

---

# 3. IMPORTANT DIFFERENTIATING FEATURE

Our main differentiating feature is:

## Browser Reliability / Calibration

A major problem with browser-based cognitive experiments is that different devices, browsers, displays, refresh rates, frame rendering behavior, and input mechanisms can affect timing measurements.

Before an experiment starts, we want to perform a short calibration/compatibility check.

The system should collect relevant browser/device timing information such as:

* Screen refresh characteristics where measurable
* Frame timing/stability
* Input responsiveness
* Browser/device information
* Other practical signals that can indicate measurement quality

Then generate a session-level reliability score.

Example:

Reliability Score: 93/100

Display stability: Good
Frame consistency: Good
Input responsiveness: Good

The reliability score should belong to the PARTICIPANT SESSION, not globally to the browser.

---

# 4. IMPORTANT SCIENTIFIC/TECHNICAL CONSTRAINT

Do NOT claim that our reliability score magically makes browser timing equivalent to laboratory equipment.

Instead:

* Preserve the raw measurement.
* Preserve the calibration/reliability information.
* Use the reliability score to contextualize the measurement.
* Flag potentially unreliable sessions.
* If we calculate a quality-adjusted/normalized value, the calculation must be explicit and explainable.
* Never overwrite raw reaction time.

Example:

Raw reaction time: 247 ms
Reliability score: 93/100
Quality-aware reading: 251 ms

The exact adjustment formula should only be used if we can justify it.

If a scientifically questionable adjustment would be better represented as a warning/flag rather than modifying the value, tell me that.

The backend must store the raw data regardless.

---

# 5. HACKATHON MVP

We only have 6 hours.

The backend MVP should support:

## Authentication

* Researcher registration
* Researcher login
* Authentication for researcher APIs

Participants should NOT need accounts.

## Experiments

* Create experiment
* Get researcher's experiments
* Get a specific experiment
* Update experiment if necessary
* Publish experiment
* Generate/share a public experiment identifier

## Trials

An experiment can contain multiple trials.

A trial can contain things such as:

* Stimulus
* Stimulus type
* Duration
* Expected response
* Trial order
* Other minimal configuration required for the demo

## Participant Sessions

When a participant starts an experiment:

* Generate anonymous participant/session ID
* Associate it with the experiment
* Store calibration/reliability information
* Track start/completion status

## Responses

For every trial:

* Trial ID
* Participant/session ID
* Response
* Reaction time
* Correct/incorrect
* Timestamp

## Results

Researcher should be able to retrieve:

* Number of participants
* Average reaction time
* Median reaction time if feasible
* Accuracy
* Reliability scores
* Individual anonymous participant sessions
* Individual trial results
* Low-reliability session flags

---

# 6. PROPOSED TECH STACK

Use:

### Backend

* Node.js
* Javascript
* Express

### Database

* MongoDB

### Database access

* mongoose

### API testing

* Postman

### Authentication

Use a simple secure authentication mechanism suitable for a 6-hour hackathon.

Do not introduce an unnecessarily complicated authentication architecture.

### Frontend

The frontend team will decide this, but assume they are consuming REST APIs.

The backend should therefore expose clean REST endpoints.

---

# 7. BACKEND ARCHITECTURE

I prefer this architecture:

Client
↓
Route
↓
Controller
↓
Service
↓
Repository
↓
PostgreSQL

Responsibilities:

### Route

Defines:

* HTTP method
* URL
* Validation
* Which controller handles the request

### Controller

Handles:

* HTTP request
* Parameters
* Body
* Calling service
* HTTP response/status code

The controller should NOT contain business logic or SQL.

### Service

Contains:

* Business logic
* Experiment rules
* Publishing logic
* Participant/session logic
* Reliability interpretation
* Validation that is business-specific
* Orchestration between repositories

### Repository

Contains:

* SQL queries
* Database operations
* pg pool/query calls

The service should NOT directly call pool.query().

### Types

Contains TypeScript types for:

* Experiment
* Trial
* ParticipantSession
* Response
* User
* Request bodies
* Response objects
* Enums/unions where appropriate

Prefer TypeScript string unions over TypeScript enums where practical.

### Utils

For genuinely reusable functions only.

For example:

* Random number generation
* ID helpers if needed
* Timing/math helpers

Do not put business-specific experiment logic inside generic utilities.

---

# 8. PROPOSED FOLDER STRUCTURE

Start simple.

Something like:

src/
├── server.ts
│
├── db/
│   └── connection.ts
│
├── auth/
│   ├── auth.routes.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.repository.ts
│   └── auth.types.ts
│
├── experiments/
│   ├── experiment.routes.ts
│   ├── experiment.controller.ts
│   ├── experiment.service.ts
│   ├── experiment.repository.ts
│   └── experiment.types.ts
│
├── trials/
│   ├── trial.routes.ts
│   ├── trial.controller.ts
│   ├── trial.service.ts
│   ├── trial.repository.ts
│   └── trial.types.ts
│
├── participants/
│   ├── participant.routes.ts
│   ├── participant.controller.ts
│   ├── participant.service.ts
│   ├── participant.repository.ts
│   └── participant.types.ts
│
├── responses/
│   ├── response.routes.ts
│   ├── response.controller.ts
│   ├── response.service.ts
│   ├── response.repository.ts
│   └── response.types.ts
│
├── calibration/
│   ├── calibration.service.ts
│   └── calibration.types.ts
│
├── utils/
│   └── random.ts
│
└── errors/
└── error.handler.ts

However, do NOT force us to create every file immediately.

Create folders/files only when that feature is actually being implemented.

---

# 9. DATABASE DESIGN

Keep the database small enough for the hackathon.

Proposed core entities:

users
experiments
trials
participant_sessions
responses

Relationships:

User
↓
has many Experiments

Experiment
↓
has many Trials

Experiment
↓
has many Participant Sessions

Participant Session
↓
has many Responses

Conceptually:

User
└── Experiment
├── Trial
├── Trial
├── Trial
│
└── Participant Session
├── Response
├── Response
└── Response

---

# 10. EXPERIMENT TABLE

Potential fields:

id
researcher_id
title
description
instructions
status
created_at
updated_at
published_at

Status can be:

DRAFT
PUBLISHED
CLOSED

Do not allow arbitrary participants to access DRAFT experiments.

---

# 11. TRIAL TABLE

Potential fields:

id
experiment_id
trial_order
stimulus_type
stimulus
duration_ms
expected_response
created_at

Keep this minimal.

If the frontend needs richer configuration, consider a JSON/JSONB configuration field rather than creating 20 database columns during the hackathon.

---

# 12. PARTICIPANT SESSION TABLE

Potential fields:

id
experiment_id
anonymous_code
reliability_score
calibration_data
started_at
completed_at
status

Possible status:

STARTED
COMPLETED
ABANDONED

Do NOT store unnecessary personally identifying information.

The participant should remain anonymous.

---

# 13. RESPONSE TABLE

Potential fields:

id
participant_session_id
trial_id
response
reaction_time_ms
correct
stimulus_timestamp
response_timestamp
created_at

Raw timing information should be preserved.

---

# 14. API DESIGN

Keep the API small.

Potential researcher APIs:

POST /auth/register
POST /auth/login

POST /experiments
GET /experiments
GET /experiments/:id
PATCH /experiments/:id
POST /experiments/:id/publish

POST /experiments/:id/trials
GET /experiments/:id/trials

Potential participant APIs:

POST /experiments/:id/start
POST /experiments/:id/calibration
POST /sessions/:id/responses
POST /sessions/:id/complete

Results:

GET /experiments/:id/results
GET /experiments/:id/results/:sessionId

Do not blindly implement every endpoint.

We should prioritize the minimum flow needed for a working demo.

---

# 15. PARTICIPANT EXPERIMENT FLOW IN DETAIL

Participant opens:

GET /experiments/:publicId

The backend returns the published experiment configuration.

Participant clicks Start.

Backend creates:

Participant Session

and returns:

session_id
anonymous_code

Then calibration information is submitted.

The backend stores:

* Calibration data
* Reliability score

Then the frontend runs the trials.

For each response:

Frontend sends something like:

session_id
trial_id
response
reaction_time_ms
stimulus_timestamp
response_timestamp

Backend stores it.

After all trials:

Participant completes session.

Backend marks:

COMPLETED

and calculates/returns the participant's result summary.

---

# 16. IMPORTANT TIMING ARCHITECTURE

The browser is responsible for detecting:

* When a stimulus is presented
* When the participant responds

The frontend should use high-resolution browser timing APIs where appropriate.

The backend should NOT try to measure the participant's reaction time using:

request received time - response received time

because network latency would make that measurement inaccurate.

Instead:

Browser calculates the raw reaction interval locally.

Example:

Stimulus timestamp:
12345.231 ms

Response timestamp:
12592.481 ms

Reaction time:
247.250 ms

Then backend stores the resulting raw measurement along with timestamps.

The backend's responsibility is:

* Validation
* Persistence
* Analysis
* Aggregation
* Data integrity

---

# 17. RELIABILITY SCORE ARCHITECTURE

Calibration should produce raw measurements.

Example:

{
refreshRate: 120,
frameJitter: 2.1,
inputLatency: 8,
droppedFrames: 1
}

Then a calibration service can interpret those measurements.

Example:

Calibration
↓
Evaluate signals
↓
Reliability Score
↓
Store score + raw calibration data

Do not hide the calculation.

If possible, define an explicit scoring model such as:

Reliability Score =
weighted combination of measurable calibration signals

The exact scoring formula should be simple enough to explain to judges.

Do not claim scientific validation unless we actually have evidence.

---

# 18. ERROR HANDLING

Use a global Fastify error handler.

Conceptually:

Request
↓
Validation
↓
Controller
↓
Service
↓
Repository
↓
Error
↓
Global Error Handler
↓
HTTP response

Do not put giant try/catch blocks everywhere.

Use appropriate HTTP status codes:

400 → invalid input
401 → unauthenticated
403 → unauthorized
404 → not found
409 → conflict
500 → unexpected server error

Database constraints should also protect the data.

---

# 19. SECURITY

At minimum:

* Passwords must never be stored as plain text.
* Use password hashing.
* Validate incoming data.
* Use parameterized SQL queries.
* Never concatenate user input into SQL.
* Researchers should only access their own experiments.
* Participants should not be able to access researcher-only APIs.
* Participant identities should remain anonymous.
* Do not expose unnecessary database fields.
* Do not trust client-provided experiment ownership.
* Validate experiment/session/trial relationships on the backend.

For the hackathon, keep security realistic but don't spend hours implementing enterprise security infrastructure.

---

# 20. WHAT WE SHOULD NOT BUILD

Because this is a 6-hour hackathon, do NOT spend time building:

* Full enterprise RBAC
* Complex microservices
* Advanced distributed architecture
* Real-time collaboration
* Complicated drag-and-drop editor
* Huge statistical analysis engine
* Complex AI system
* 30+ API endpoints
* Complicated deployment infrastructure
* Unnecessary third-party services

The objective is a convincing end-to-end working product.

---

# 21. DEVELOPMENT PRIORITY

Build in this order:

PHASE 1
Backend + MongoDB setup

↓

PHASE 2
Researcher authentication

↓

PHASE 3
Create experiment

↓

PHASE 4
Create trials

↓

PHASE 5
Publish experiment

↓

PHASE 6
Participant starts experiment

↓

PHASE 7
Create anonymous session

↓

PHASE 8
Calibration + reliability score

↓

PHASE 9
Store responses

↓

PHASE 10
Complete experiment

↓

PHASE 11
Results/analytics

↓

PHASE 12
Frontend integration

↓

PHASE 13
Polish + bug fixing

If time runs short, stop adding features and make the existing pipeline stable.

---

# 22. GIT WORKFLOW

We are working as a 4-person team.

Use GitHub from the beginning.

Main branch:

main

Each developer should work on their own branch.

Examples:

backend
frontend
dashboard
integration

Commit frequently after meaningful milestones.

Examples:

"Setup Fastify backend"
"Add experiment creation API"
"Add trial repository"
"Implement participant session"
"Add calibration endpoint"

Do not wait until the end to push code.

---

# 23. HOW I WANT YOU TO HELP ME

I am the backend developer.

I already know basic:

* JavaScript
* Node.js
* Express
* MongoDB
* REST APIs
* Git/GitHub
* Controller/service/repository architecture

I want to implement the backend myself.

Do NOT dump the entire backend codebase on me.

Instead:

1. Explain the architecture.
2. Give me one milestone at a time.
3. Explain WHY we are making each decision.
4. Let me implement it.
5. Review my code when I send it.
6. Point out bugs and architectural problems.
7. Suggest improvements only when they are relevant.
8. Avoid introducing unnecessary technologies.
9. Keep the 6-hour hackathon constraint in mind.
10. Prefer simple working solutions over over-engineering.

When I ask "what should I do next?", give me the next concrete backend milestone rather than an enormous checklist.

Our ultimate backend goal is:

Researcher
↓
Create Experiment
↓
Configure Trials
↓
Publish
↓
Participant opens link
↓
Anonymous Session
↓
Calibration
↓
Reliability Score
↓
Experiment
↓
Raw Responses
↓
Results
↓
Researcher Analytics

Help me build this pipeline cleanly and quickly.





------------------------------------------------


# Frontend Development Prompt — Web-Based Cognitive Experiment Platform

You are helping me build the **frontend** for a 6-hour hackathon MVP called a **Web-Based Cognitive Experiment Platform**.

The platform allows researchers to create and publish browser-based psychology/cognitive experiments. Participants open a public experiment link without creating an account, complete trials, and their anonymous responses and reaction times are recorded. Researchers can later view experiment results and analytics.

The frontend must be designed **around the existing backend API**, not as an independent architecture.

---

# 1. Product Goal

The platform has two major frontend experiences:

### Researcher side

A researcher can:

1. Register/login.
2. View their experiments.
3. Create an experiment.
4. Add/configure multiple trials.
5. Save the experiment as a draft.
6. Edit the draft.
7. Publish the experiment.
8. Get a shareable participant link.
9. View anonymous participant sessions.
10. View experiment results and analytics.
11. Identify sessions with low reliability.

### Participant side

A participant:

1. Opens a public experiment link.
2. Sees experiment instructions.
3. Starts an anonymous session.
4. Performs browser/device calibration.
5. Receives a reliability score.
6. Starts the experiment.
7. Sees stimuli/trials.
8. Responds to stimuli.
9. Frontend measures reaction time using browser high-resolution timing APIs.
10. Sends responses to the backend.
11. Completes the experiment.
12. Sees a completion/results screen.

Participants must NOT need an account.

---

# 2. Core Product Flow

The complete application should follow this flow:

```text
RESEARCHER

Login
  ↓
Dashboard
  ↓
Create Experiment
  ↓
Configure Experiment
  ↓
Add Trials
  ↓
Save Draft
  ↓
Preview
  ↓
Publish
  ↓
Generate Shareable Link
  ↓
View Results
```

Participant:

```text
Shareable Experiment Link
  ↓
Experiment Instructions
  ↓
Start Experiment
  ↓
Anonymous Session Created
  ↓
Browser Calibration
  ↓
Reliability Score
  ↓
Experiment Runner
  ↓
Trial 1
  ↓
Trial 2
  ↓
Trial 3
  ↓
...
  ↓
Experiment Complete
  ↓
Completion Screen
```

---

# 3. Important Backend Relationship

The backend already follows this architecture:

```text
Frontend
   ↓
HTTP API
   ↓
Fastify Routes
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
MongoDB
```

The frontend should NEVER directly access PostgreSQL.

The frontend communicates only with backend APIs.

```text
React Frontend
      ↓
API Client
      ↓
Fastify Backend
      ↓
PostgreSQL
```

Do not create frontend logic that duplicates backend business logic unnecessarily.

---

# 4. Tech Stack

Use:

### Core

* React
* Javascript
* Vite

### Styling

Use a simple modern styling approach such as:

* Tailwind CSS

or another lightweight styling solution if already configured.

Do not waste hackathon time creating a huge design system.

### Routing

* React Router

### API communication

* Axios

Prefer a centralized API client rather than calling APIs randomly throughout components.

### State

Use React state/hooks initially.

Do NOT introduce Redux or another large state-management system unless there is a genuine requirement.

For server/API state, simple hooks are sufficient for the hackathon MVP.

---

# 5. Frontend Architecture

Use a clean feature-oriented structure.

Suggested structure:

```text
src/
│
├── components/
│   ├── ui/
│   ├── forms/
│   └── common/
│
├── pages/
│   ├── auth/
│   ├── researcher/
│   └── participant/
│
├── features/
│   ├── auth/
│   ├── experiments/
│   ├── trials/
│   ├── participant/
│   └── results/
│
├── services/
│   ├── api.ts
│   ├── auth.api.ts
│   ├── experiments.api.ts
│   ├── sessions.api.ts
│   └── results.api.ts
│
├── hooks/
│
├── types/
│
├── utils/
│
├── routes/
│
├── App.tsx
└── main.tsx
```

Do NOT create all folders blindly at the beginning.

Start with the minimum required structure and introduce additional folders when their functionality is implemented.

---

# 6. API Layer

Create a centralized API client.

Conceptually:

```text
React Component
      ↓
Feature API function
      ↓
Central API client
      ↓
Backend
```

For example:

```text
experiments.api.ts
      ↓
api.ts
      ↓
GET /experiments
```

Do not put raw `fetch()` calls everywhere inside UI components.

---

# 7. Backend API Contract

The frontend should integrate with these backend endpoints.

## Authentication

```http
POST /auth/register
POST /auth/login
```

Researcher login should establish the authenticated session according to the backend's authentication mechanism.

The frontend should not store sensitive credentials unnecessarily.

---

# 8. Researcher Experiment APIs

```http
POST /experiments
GET /experiments
GET /experiments/:id
PATCH /experiments/:id
POST /experiments/:id/publish
```

Frontend responsibilities:

### Dashboard

Display:

* Experiment name
* Description
* Status
* Created date
* Updated date
* Published state
* Number of participants if available

Example:

```text
My Experiments

------------------------------------------------
Memory Recall Test
Status: PUBLISHED
Participants: 42
[View] [Results] [Share]
------------------------------------------------

Reaction Time Experiment
Status: DRAFT
[Continue Editing]
------------------------------------------------
```

---

# 9. Experiment Creation UI

Create a form containing fields supported by the backend.

For example:

```text
Experiment Title
Description
Instructions
```

Do not add frontend-only fields that the backend cannot store unless they are intentionally local UI state.

Flow:

```text
Create Experiment
      ↓
POST /experiments
      ↓
Experiment ID returned
      ↓
Open Experiment Builder
```

---

# 10. Experiment Builder

The researcher should be able to create multiple trials.

Example:

```text
Experiment Builder

Experiment:
Reaction Time Test

------------------------------------------------

Trial 1
Type: Visual
Stimulus: RED
Duration: 1000 ms
Expected Response: SPACE

------------------------------------------------

Trial 2
Type: Visual
Stimulus: BLUE
Duration: 1000 ms
Expected Response: SPACE

------------------------------------------------

Trial 3
Type: Visual
Stimulus: GREEN
Duration: 1000 ms
Expected Response: SPACE

------------------------------------------------

[+ Add Trial]

[Save Draft]       [Preview]       [Publish]
```

The UI should make it obvious that an experiment contains multiple trials.

---

# 11. Trial Model

Backend trial concepts include:

```text
id
experiment_id
trial_order
stimulus_type
stimulus
duration_ms
expected_response
```

The frontend should use TypeScript types matching the backend API contract.

Example conceptual type:

```ts
type Trial = {
  id: string;
  trial_order: number;
  stimulus_type: string;
  stimulus: string;
  duration_ms: number;
  expected_response?: string;
};
```

Do not blindly copy database types if the API response is different.

Frontend types should represent the actual API contract.

---

# 12. Draft → Published Lifecycle

The frontend must clearly represent:

```text
DRAFT
PUBLISHED
CLOSED
```

Draft experiments can be edited.

Published experiments should have appropriate restrictions depending on the backend implementation.

The frontend must NOT simply show a "Publish" button and assume publishing succeeded.

Flow:

```text
Click Publish
      ↓
POST /experiments/:id/publish
      ↓
Backend validates
      ↓
Success
      ↓
Frontend updates status
      ↓
Shareable link appears
```

---

# 13. Shareable Participant Link

After publishing, show the researcher a clear participant link.

Example:

```text
Experiment Published!

Participant Link:

https://frontend.com/experiment/abc123

[Copy Link]
```

The public ID/link should come from the backend or the defined API contract.

Do not expose internal database information unnecessarily.

---

# 14. Participant Routes

Participant routes should be completely separate from researcher dashboard routes.

Example:

```text
/experiment/:experimentId
/experiment/:experimentId/instructions
/experiment/:experimentId/calibration
/experiment/:experimentId/run
/experiment/:experimentId/complete
```

Participant should not need login.

---

# 15. Participant Experiment Flow

When a participant opens:

```text
/experiment/:experimentId
```

Frontend should fetch the public experiment information.

Show:

```text
Reaction Time Experiment

This experiment measures your response
time to visual stimuli.

Estimated duration: 3 minutes

[Start Experiment]
```

---

# 16. Anonymous Session Creation

When participant starts:

```http
POST /experiments/:id/start
```

Backend creates an anonymous participant session.

Frontend receives something conceptually like:

```json
{
  "sessionId": "...",
  "anonymousCode": "P-8F42"
}
```

The frontend needs the `sessionId` for subsequent response submissions.

Do NOT create participant accounts.

Do NOT ask participants for personally identifying information.

---

# 17. Browser Calibration

Before the experiment begins, provide a calibration screen.

Example:

```text
Preparing Your Experiment

Checking your browser...

✓ Screen detected
✓ Input detected
✓ Timing environment checked

Reliability Score

87 / 100

Your environment is suitable for this experiment.

[Continue]
```

The exact score should come from the backend or agreed calibration logic.

Do not invent scientific claims such as:

> "Your browser is laboratory-grade."

Instead use neutral wording such as:

> "This score indicates the quality/stability of the current session environment."

---

# 18. Calibration UI

The frontend may collect relevant browser/session measurements such as:

* screen dimensions
* device/browser information
* frame timing observations
* input responsiveness
* timing stability
* dropped-frame/jitter observations where measurable

Send the required calibration data to:

```http
POST /experiments/:id/calibration
```

or the agreed backend endpoint.

Do not collect unnecessary personally identifying information.

---

# 19. Experiment Runner — MOST IMPORTANT FRONTEND COMPONENT

The experiment runner is the core participant experience.

It should NOT behave like a normal form.

Example:

```text
        +

     [STIMULUS]

        +

Press SPACE when you see the target
```

The runner should control:

```text
Trial
 ↓
Prepare
 ↓
Stimulus appears
 ↓
Start high-resolution timer
 ↓
Participant responds
 ↓
Stop timer
 ↓
Calculate reaction time
 ↓
Record response
 ↓
Next trial
```

---

# 20. Reaction Time Measurement

This is critical.

Do NOT calculate reaction time using:

```text
HTTP request time - HTTP request time
```

because network latency affects that measurement.

The browser should measure reaction time locally.

Use an appropriate browser high-resolution timing API such as:

```text
performance.now()
```

Conceptually:

```ts
const stimulusTime = performance.now();

...

const responseTime = performance.now();

const reactionTime = responseTime - stimulusTime;
```

The frontend sends the measured reaction time to the backend.

Example:

```json
{
  "trialId": "...",
  "response": "SPACE",
  "reactionTimeMs": 247.25,
  "stimulusTimestamp": 12345.231,
  "responseTimestamp": 12592.481
}
```

The backend stores the measurement.

---

# 21. Important Timing Rule

The frontend must preserve the distinction between:

### Raw measurement

What the browser actually measured.

and

### Reliability / quality information

How trustworthy the measurement environment appears to be.

Never silently modify:

```text
rawReactionTime
```

based on a reliability score.

If a quality-adjusted metric is ever implemented, it must be explicitly named and documented.

Prefer storing:

```text
reaction_time_ms
reliability_score
```

separately.

---

# 22. Keyboard/Input Handling

The experiment runner may need keyboard responses.

Example:

```text
Press A for LEFT
Press L for RIGHT
```

The frontend should:

1. Listen for the required input.
2. Capture the high-resolution response timestamp.
3. Determine response.
4. Calculate reaction time.
5. Save the response.
6. Move to the next trial.

Avoid accidental double submissions.

The UI should also prevent inputs from previous trials from being incorrectly recorded for the next trial.

---

# 23. Trial State Machine

Do not build the experiment runner as a collection of random `setTimeout()` calls without understanding its state.

Think of each trial as:

```text
READY
  ↓
STIMULUS_SHOWN
  ↓
WAITING_FOR_RESPONSE
  ↓
RESPONDED
  ↓
SAVED
  ↓
NEXT_TRIAL
```

For the overall experiment:

```text
LOADING
 ↓
INSTRUCTIONS
 ↓
CALIBRATION
 ↓
RUNNING
 ↓
COMPLETING
 ↓
COMPLETED
```

This should make the experiment runner predictable and easier to debug.

---

# 24. Response API

For each trial:

```http
POST /sessions/:id/responses
```

Example payload:

```json
{
  "trialId": "...",
  "response": "SPACE",
  "reactionTimeMs": 247.25,
  "stimulusTimestamp": 12345.231,
  "responseTimestamp": 12592.481
}
```

The frontend should not assume that the response was successfully stored.

Handle:

```text
Loading
Success
Failure
```

states.

For example:

```text
Saving response...
```

However, avoid unnecessary UI delays that interfere with the experiment timing.

The timing measurement must already be completed before network communication begins.

---

# 25. Completing Experiment

After all trials:

```http
POST /sessions/:id/complete
```

Then show:

```text
Experiment Complete

Thank you for participating.

Your session has been recorded successfully.

[View Summary]
```

---

# 26. Researcher Results Dashboard

Researcher should be able to see anonymous experiment results.

Endpoint:

```http
GET /experiments/:id/results
```

Potential information:

```text
Experiment Results

Participants: 42

Average Reaction Time: 382 ms
Median Reaction Time: 351 ms
Average Accuracy: 91%

Reliability

High: 31
Medium: 8
Low: 3
```

Then individual anonymous sessions:

```text
Participant    Accuracy    Avg RT    Reliability
-------------------------------------------------
P-8F42         94%         321ms     91
P-12AC         89%         402ms     84
P-72BD         77%         491ms     61
```

Do not expose participant identity.

---

# 27. Low Reliability Handling

A low reliability score should be shown as a flag.

Example:

```text
P-72BD

Reliability: 61

⚠ Low reliability

[View Session]
```

Do NOT automatically delete or hide these results.

Researchers should be able to distinguish:

```text
Raw data
+
Reliability information
```

---

# 28. Individual Session Results

A researcher can open an anonymous session.

Example:

```text
Participant: P-72BD

Reliability: 61
Accuracy: 77%

Trials

Trial     Response     Reaction Time
------------------------------------
1         SPACE        312 ms
2         WRONG        621 ms
3         SPACE        402 ms
4         SPACE        389 ms
```

This is useful for demonstrating that the platform records trial-level experimental data.

---

# 29. Authentication UI

Create:

```text
/login
/register
```

Simple forms are enough.

Login:

```text
Email
Password

[Login]

Don't have an account?
[Register]
```

Registration:

```text
Name
Email
Password

[Create Account]
```

Do not overbuild authentication for the hackathon.

The backend remains responsible for authentication and authorization.

---

# 30. Protected Researcher Routes

Researcher routes should be protected:

```text
/dashboard
/experiments
/experiments/:id
/experiments/:id/results
```

Participant routes remain public:

```text
/experiment/:id
```

Frontend route protection improves UX, but the backend MUST remain the actual authorization boundary.

Never rely on React route protection for security.

---

# 31. Error Handling

Every API interaction should have predictable states:

```text
Loading
Success
Error
```

Examples:

```text
Unable to load experiments.

Retry
```

or:

```text
Failed to publish experiment.

Please try again.
```

Do not expose raw PostgreSQL errors to the user.

Backend should return structured API errors, and frontend should convert them into useful UI messages.

---

# 32. Loading States

Use proper loading states.

Examples:

```text
Loading experiments...
```

```text
Creating experiment...
```

```text
Publishing...
```

```text
Loading results...
```

Avoid blank screens while API calls are running.

---

# 33. Form Validation

Frontend should validate obvious user errors before sending requests.

Examples:

```text
Title cannot be empty.

Duration must be greater than 0.

Expected response is required.
```

But remember:

**Frontend validation is for UX.**

Backend validation is still mandatory.

Never assume frontend validation makes an API request safe.

---

# 34. Types

Create shared frontend TypeScript types representing API responses and UI models.

Example:

```ts
type ExperimentStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "CLOSED";
```

```ts
type Experiment = {
  id: string;
  title: string;
  description: string;
  instructions: string;
  status: ExperimentStatus;
  createdAt: string;
  updatedAt: string;
};
```

Keep frontend types aligned with the actual backend response format.

If the backend returns snake_case, either consistently use it or transform it at the API boundary.

Do not mix naming conventions randomly throughout the application.

---

# 35. UI Design

The UI should feel like a serious research platform rather than a generic CRUD dashboard.

Use:

* clean dashboard
* clear experiment status
* simple experiment builder
* large readable experiment stimuli
* minimal participant UI
* responsive layout
* clear typography
* obvious buttons
* useful empty states
* useful error states

Participant experiment UI should be extremely minimal because distractions can affect the experiment.

---

# 36. Researcher Dashboard Layout

Suggested:

```text
------------------------------------------------
FlowForge Research
------------------------------------------------

Dashboard

[ + Create Experiment ]

Your Experiments

------------------------------------------------
Memory Response Test
PUBLISHED
42 Participants

[Open] [Results] [Share]
------------------------------------------------

Visual Attention Study
DRAFT

[Continue]
------------------------------------------------
```

---

# 37. Experiment Builder Layout

Use a structure similar to:

```text
------------------------------------------------
Experiment Builder

Experiment Details
[Title]
[Description]
[Instructions]

Trials
------------------------------------------------

Trial 1
[Stimulus Type]
[Stimulus]
[Duration]
[Expected Response]

------------------------------------------------

Trial 2
[Stimulus Type]
[Stimulus]
[Duration]
[Expected Response]

[+ Add Trial]

-----------------------------------------------

[Save Draft]     [Preview]     [Publish]
```

The researcher should understand the experiment structure immediately.

---

# 38. Preview Mode

Before publishing, researchers should be able to preview the experiment.

Preview should behave similarly to the participant experience but should NOT create real participant data.

Conceptually:

```text
Builder
 ↓
Preview
 ↓
Experiment Runner
```

The preview can use local/mock session state.

Do not accidentally create real participant sessions during preview.

---

# 39. Important Frontend/Backend Boundary

Frontend is responsible for:

```text
UI
User interaction
Browser timing measurement
Experiment presentation
Client-side validation
Displaying API data
Navigation
Loading/error states
```

Backend is responsible for:

```text
Authentication
Authorization
Experiment ownership
Business rules
Experiment publishing
Session creation
Data validation
Persistence
Response storage
Result calculation
Reliability calculation
Security
```

Do NOT move backend business logic into React.

---

# 40. Security Requirements

The frontend must:

* Never contain database credentials.
* Never connect directly to PostgreSQL.
* Never trust frontend authorization.
* Never expose private researcher data to participants.
* Avoid storing sensitive information unnecessarily.
* Avoid putting secrets in Vite environment variables.
* Only expose genuinely public frontend configuration through environment variables.

Remember:

```text
VITE_* variables are not secret.
```

Anything shipped to the browser can potentially be inspected.

---

# 41. Environment Configuration

Use something like:

```env
VITE_API_BASE_URL=http://localhost:3000
```

The frontend should call:

```text
${VITE_API_BASE_URL}/experiments
```

Do not hardcode backend URLs throughout components.

---

# 42. CORS

Because frontend and backend may run on different local ports:

```text
Frontend
localhost:5173

Backend
localhost:3000
```

The backend must allow the frontend origin through appropriate CORS configuration.

Frontend should NOT attempt to work around CORS.

---

# 43. What NOT to Build

This is a 6-hour hackathon.

Do NOT waste time building:

* Redux unless absolutely necessary
* Microfrontends
* Complex design systems
* Real-time collaboration
* Drag-and-drop builder unless extremely simple
* Advanced statistical analysis
* AI-generated experiments
* Complex animations
* Full GDPR compliance system
* Enterprise RBAC
* Huge component libraries
* Offline-first architecture
* Complicated caching
* Overengineered state management

The goal is a convincing working MVP.

---

# 44. MVP Priority

Implement in this order:

### Phase 1 — Application foundation

```text
React
TypeScript
Vite
Routing
API client
Basic layout
```

### Phase 2 — Researcher authentication

```text
Register
Login
Protected dashboard
```

### Phase 3 — Experiment management

```text
Create experiment
List experiments
View experiment
Edit experiment
```

### Phase 4 — Trial builder

```text
Add trial
Edit trial
Delete trial
Reorder trials if time permits
```

### Phase 5 — Publishing

```text
Publish
Generate public link
Copy link
```

### Phase 6 — Participant flow

```text
Open experiment
Instructions
Start session
Calibration
```

### Phase 7 — Experiment runner

```text
Display stimulus
Capture input
Measure reaction time
Submit response
Move to next trial
```

### Phase 8 — Completion

```text
Complete session
Show completion screen
```

### Phase 9 — Researcher analytics

```text
Participant count
Average RT
Median RT
Accuracy
Reliability
Individual anonymous sessions
```

### Phase 10 — Polish

```text
Loading states
Error states
Responsive UI
Empty states
Copy link
Better styling
Demo preparation
```

---

# 45. Backend Integration Contract

Assume the backend developer is implementing:

```text
POST   /auth/register
POST   /auth/login

POST   /experiments
GET    /experiments
GET    /experiments/:id
PATCH  /experiments/:id
POST   /experiments/:id/publish

POST   /experiments/:id/trials
GET    /experiments/:id/trials

POST   /experiments/:id/start
POST   /experiments/:id/calibration

POST   /sessions/:id/responses
POST   /sessions/:id/complete

GET    /experiments/:id/results
GET    /experiments/:id/results/:sessionId
```

If an endpoint is not implemented yet, create the frontend integration around a clearly defined API contract rather than inventing a completely different backend.

---

# 46. Important: Backend-Frontend Coordination

When implementing frontend features, always identify:

```text
Frontend requirement
        ↓
Required API
        ↓
Request payload
        ↓
Backend response
        ↓
Frontend UI
```

For example:

```text
"Publish Experiment"

Frontend:
POST /experiments/:id/publish

        ↓

Backend:
Validate researcher ownership
Validate experiment
Change status
Generate/return public identifier

        ↓

Response:
{
    id: "...",
    status: "PUBLISHED",
    publicId: "abc123"
}

        ↓

Frontend:
Show shareable participant link
```

Do not invent API response shapes without coordinating with the backend.

---

# 47. Recommended Component Breakdown

Keep components reasonably small.

Examples:

```text
Dashboard
ExperimentCard
ExperimentForm
TrialEditor
TrialList
PublishButton
ShareLink
CalibrationScreen
ExperimentRunner
TrialRenderer
ResultsTable
ReliabilityBadge
LoadingSpinner
ErrorMessage
```

Do not split every three lines of JSX into a component.

Component boundaries should exist where there is a meaningful UI responsibility.

---

# 48. Experiment Runner Architecture

The runner is important enough to keep isolated.

Conceptually:

```text
ExperimentRunner
        ↓
Current Trial
        ↓
TrialRenderer
        ↓
Timing Controller
        ↓
Input Handler
        ↓
Response
        ↓
API Submission
        ↓
Next Trial
```

The runner should know:

```text
currentTrialIndex
currentTrial
trialState
stimulusTime
response
reactionTime
```

Avoid putting experiment-running logic inside generic dashboard components.

---

# 49. Demo Scenario

The final demo should be able to show:

```text
1. Researcher logs in
        ↓
2. Creates "Visual Reaction Test"
        ↓
3. Adds 3–5 trials
        ↓
4. Saves draft
        ↓
5. Publishes
        ↓
6. Copies participant link
        ↓
7. Opens participant link
        ↓
8. Starts anonymous session
        ↓
9. Runs calibration
        ↓
10. Gets reliability score
        ↓
11. Performs trials
        ↓
12. Reaction times are captured
        ↓
13. Completes experiment
        ↓
14. Researcher opens results
        ↓
15. Anonymous participant data is displayed
        ↓
16. Low-reliability session is visibly flagged
```

This entire flow is more important than having dozens of features.

---

# 50. Development Rules

When helping me implement this frontend:

1. Do not dump the entire frontend codebase at once.
2. Guide me one milestone at a time.
3. Explain why each architectural decision is being made.
4. Assume I understand basic JavaScript/React but want to improve my engineering skills.
5. Do not introduce unnecessary libraries.
6. Keep frontend architecture aligned with the backend.
7. Whenever an API is required, explicitly state:

   * HTTP method
   * endpoint
   * request body
   * response shape
   * error cases
8. Keep the code hackathon-friendly.
9. Prioritize working functionality over visual perfection.
10. Do not overengineer.
11. If my proposed architecture is unnecessarily complex, tell me directly.
12. If a backend change is required for frontend functionality, explicitly point it out.
13. Do not silently invent backend endpoints.
14. Use TypeScript properly instead of falling back to `any`.
15. Keep the participant experiment runner isolated from normal dashboard UI.
16. Treat reaction-time measurement as a special technical requirement, not as ordinary CRUD form submission.

---

# 51. Final Architecture

The overall system should look like:

```text
                    ┌──────────────────────┐
                    │      RESEARCHER      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React Dashboard    │
                    │   Experiment Builder │
                    └──────────┬───────────┘
                               │
                               │ HTTP API
                               ▼
                    ┌──────────────────────┐
                    │   Fastify Backend    │
                    │                      │
                    │ Routes               │
                    │ Controllers          │
                    │ Services             │
                    │ Repositories         │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     PostgreSQL       │
                    └──────────────────────┘


                    ┌──────────────────────┐
                    │     PARTICIPANT      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ React Participant UI │
                    │                      │
                    │ Instructions         │
                    │ Calibration          │
                    │ Experiment Runner    │
                    │ High-res Timing      │
                    └──────────┬───────────┘
                               │
                               │ HTTP API
                               ▼
                    ┌──────────────────────┐
                    │   Fastify Backend    │
                    └──────────────────────┘
```

The key idea is:

**The researcher side is a management application.**

**The participant side is a timing-sensitive experiment application.**

These are two different frontend experiences communicating with the same backend.

Build the simplest complete end-to-end flow first, then add polish.
