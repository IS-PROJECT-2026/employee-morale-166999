# Project Submission Report

## 1. Student Details

- **Full Name:** Sikuku Glen Barasa
- **GitHub Username:** GlenSikuku9
- **Email:** [sikukuglen8@gmail.com]

---

## 2. Deployed Project Link

- **Live GitHub Pages URL:** [https://is-project-2026.github.io/employee-morale-166999/]

---

## 3. Reflection — Grounded in Your Git History

> **Rules:** Every answer below **must include a direct link** to the specific commit, PR, issue, or branch in your repository that demonstrates what you are describing. Answers without working links will not be graded. Generic explanations that could apply to any project will receive zero marks.
>
> **Marks:** A (2 marks) · B (1 mark) · C (1 mark) · D (1 mark) = **5 marks total**

### A. Your Best Commit

Paste the URL of the commit in your history that you think best demonstrates clean conventional commit practice (good type tag, clear subject, meaningful body or footer).

- **Commit URL:** [https://github.com/IS-PROJECT-2026/employee-morale-166999/commit/fa6679abcfb1eccf442e2565efaa4f91fe5c1ba8]
- **Why this one?** I chose this commit because it uses the feat tag to clearly identify the change as a new feature, while the subject, add management insights, briefly and clearly describes the work. The body explains the key features implemented, including feedback summaries, rating averages, recent comments, and admin rating category management. Finally, Closes #13 links the commit directly to Issue #13, making the work easy to trace.

### B. A Mistake or Struggle

Link to a commit, PR, or issue where something went wrong — a bad commit message you had to fix, a branch you had to delete and recreate, a PR that needed rework, or a deployment that broke.

- **Link to the evidence:** [https://github.com/IS-PROJECT-2026/employee-morale-166999/commit/5daa7065f6ffbd6a29ce2d16ff3f480d5b3a6f11]

- **What happened and how did you recover?** While implementing Issue #8, I accidentally included functionality that was originally intended for subsequent issues, including employee ratings, comments, and Firebase feedback storage. I updated Issue #8 to accurately document the expanded scope and then adjusted Issues #11 and #12 to reflect the functionality that had already been implemented, keeping the remaining Git workflow consistent with the actual project state.

### C. A Pull Request You're Proud Of

Paste the URL of the PR that best shows your self-review process — one where the description is clear, the issue linkage is correct, and the diff tells a coherent story.

- **PR URL:** [https://github.com/IS-PROJECT-2026/employee-morale-166999/pull/30]

- **What did you check before merging?** Before merging, I reviewed the management dashboard to confirm that the rating averages and recent feedback were displayed correctly, and I checked that managers could open an employee's record to view the full ratings and comments. I also verified that the UI improvements and admin rating-category functionality worked correctly.

### D. One Thing You Would Do Differently

If you had to restart this project from scratch with everything you know now, name one specific workflow decision you would change (not a code change — a Git/project management decision).

- **What would you change?** I would keep the work for Issue #8 strictly within its original objective and avoid completing functionality that was intended for Issue #9. Since I included some of Issue #9’s work in Issue #8, I had to change the objectives of both issues afterward to match the work that was actually completed.

- **Link to the evidence of the original decision:** [https://github.com/IS-PROJECT-2026/employee-morale-166999/issues/8]

---

## 4. Screenshots of Key GitHub Features

Demonstrate your workflow mechanics by embedding your screenshots below.

> **CRITICAL FOR WORKING IMAGES:** Do not type manual folder paths. Edit this file directly on the GitHub web interface, click on the blank line below each prompt, and **paste (Ctrl+V / Cmd+V)** your screenshot. GitHub will automatically upload the file and generate a permanent, working image link for you.

### A. Milestones and Issues

_Provide a screenshot showing your active milestone(s) and the granular tracking issues linked directly to them._

<img width="940" height="416" alt="image" src="https://github.com/user-attachments/assets/3c87c41a-0b64-44ac-984e-171b5cba40f2" />


- **Caption:** The project was organized into four milestones covering the project foundation, authentication and employee management, employee feedback and morale, and the HR dashboard and deployment, with all issues closed and completed.

### B. Project Board

_Provide a screenshot of your GitHub Project Board with your issues organized dynamically across columns (To Do, In Progress, Done)._

<img width="940" height="446" alt="image" src="https://github.com/user-attachments/assets/2262d9ab-02d9-40b1-9729-0c3ed0d08bab" />


- **Caption:** The project board shows 12 issues completed and 1 issue currently in progress, with 2 issues still in the Todo column. This shows that most of the planned work has been completed, while the remaining tasks are being finalized for submission.

### C. Branching Architecture

_Provide a screenshot showing your local or remote Git branch list, highlighting your use of conventional, issue-linked naming patterns (e.g., `feat/`, `fix/`, `style/`)._

<img width="940" height="399" alt="image" src="https://github.com/user-attachments/assets/ce564cbb-7683-43aa-aeed-d0efc15b8b7b" />


- **Caption:** I used feat/, fix/, and style/ branches for the main development, bug fixes, and UI. docs/ and chore/ branches handled documentation, setup, and submission-related tasks, while conflict/ branches were created for the merge-conflict demonstrations and evidence. Each branch follows an issue-linked naming pattern, making the work easy to trace.

### D. Pull Requests & Traceability

_Provide a screenshot of a completed or open Pull Request (PR) on GitHub that clearly shows it is linked to a related development issue._

<img width="940" height="450" alt="image" src="https://github.com/user-attachments/assets/aa253057-55a0-4614-b311-73e7eede3dd8" />


- **Caption:** Pull Request #30 implements the management insights dashboard and rating-category management, with Closes #13 linking the completed work directly to Issue #13.

---

## 5. Merge Conflict Evidence

You must engineer **three merge conflicts**, each triggered by a **different cause** from those covered in the lecture. For Conflict 1, document the full resolution lifecycle. For Conflicts 2 and 3, provide the conflict marker screenshot and identify the cause.

> **Marks:** Conflict 1 full chronology (2 marks) · Conflict 2 (1 mark) · Conflict 3 (1 mark) · All three use distinct causes (1 mark) = **5 marks total**

---

### Conflict 1 — Same-line modification

**What cause did you use?** Same-line modification.

#### Step 1: Generating the Clash

_Screenshot showing the merge attempt and the conflict warning._

<img width="940" height="297" alt="image" src="https://github.com/user-attachments/assets/c42cef81-8844-4865-b496-2b18735ca8d8" />


- **Caption:** Branch conflict/15-readme-description-alt attempted to merge changes from conflict/15-readme-description. Both branches modified the same Deployment Link line differently, causing Git to report a content conflict and stop the automatic merge.

#### Step 2: Inside the Code Editor (Conflict Markers)

_Screenshot showing the raw, unresolved conflict markers (`<<<<<<< HEAD`, `=======`, `>>>>>>>`) in your editor._

<img width="940" height="242" alt="image" src="https://github.com/user-attachments/assets/63a06544-15be-4920-b575-1692456daedb" />


- **Caption:** Both branches modified the same Deployment Link line in README.md with different text. Git could not automatically determine which version to keep, so it marked the sections as conflicting.

#### Step 3: Resolution & Clean Merge

_Screenshot of your clean Git history or completed PR showing the conflict was resolved and merged._

<img width="940" height="356" alt="image" src="https://github.com/user-attachments/assets/1c6429ca-2767-4845-80e1-9507620b2d3e" />


- **Caption:** The conflict was resolved by keeping the “Employee Morale System - Live Demo” version in README.md. The resolved file was committed, and the Git history confirms that both branches were successfully merged with no remaining conflicts.

---

### Conflict 2 — Delete vs. Modify

**What cause did you use?** Delete vs. Modify

**Why does this cause trigger a conflict?** One branch deletes a file, while another branch modifies the same file. Git cannot automatically determine whether the file should be deleted or retained with the modifications.

<img width="940" height="61" alt="image" src="https://github.com/user-attachments/assets/85acf232-3050-47af-ac71-10412f2c1cd0" />


- **Caption:** The conflict/15-update-demo branch modified docs/conflict-2-demo.md, while conflict/15-delete-vs-modify-delete deleted the same file. Git detected a modify/delete conflict and stopped the merge. I chose to leave the modified version in the working tree.

---

### Conflict 3 — Appended List

**What cause did you use?** The Appended List

**Why does this cause trigger a conflict?** Two branches add different names like Bob and Alice to the same location at the end of the list. Git sees both additions as competing changes to the same location, so it cannot automatically decide which one should come first.

<img width="940" height="201" alt="image" src="https://github.com/user-attachments/assets/90f079b7-b3e0-4ff2-82a5-2fb93cad00e1" />


- **Caption:** Two different branches appended different names (Alice and Bob) to the bottom of docs/conflict-3-list.md, causing Git to mark the overlapping additions as a conflict.

---
