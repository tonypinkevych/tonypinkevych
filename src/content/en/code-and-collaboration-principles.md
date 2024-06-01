---
title: 'Code and Collaboration principles'
description: 'The manifest describes how we work and collaborate on the code'
pubDate: 'Jun 01 2024'
published: true
---

# Code and Collaboration principles

The manifest describes how we work and collaborate on the code.

## Common

1. **Treat everything as a code**
   <br />
   Our basic paradigm is to treat the entire workflow of the company as a code. This means we should try to treat all operations/paperwork/UI design/testing/etc as we write code. For example, we have to automate the operation work as much as possible. Use pull-request-review flow for documentation, etc. Thus, we have a declarative, self-documented, source-controlled approach;
2. **Messaging over calling**
   <br />
   Instead of calls, we use text/video messaging as the main way of communication. Got an idea in mind? Write it down. Got a question? Write it down. Need something to explain someone? Write it down;
3. **Each task leaves an artifact on completion**
   <br />
   Each finished task make our project better then it was before. For example, when a colleague asks you about a “how this business process working”, instead of an explanatory meeting, you should create a document and contribute it into the project;
4. **Every request is an issue**
   <br />
   See a lack of documentation or functionality, a bug or complex code? Create an issue;
5. **No issue, no result**
   <br/>
   Don't start working on anything without creating an independent well described issue;
6. **All discussion of the issue is conducted in the issue thread**
   <br />
   When you want to discuss or ask something about the issue, go to this thread and ask there (it may be any tool your team use: github, notion etc). This way we keep all the history in one place.

## Code

1. **Be “lazy” for now**
   <br />
   Write the minimum possible amount of code to solve the issue. Found other problems while working? Create new issues! The created patch (pull request) should be atomic;
2. **Ship it fast**
   <br />
   Instead of a perfect solution with full coverage of all possible edge cases, use a good enough solution to solve the current problem and move on;
3. **Create failing tests before start working on the issue**
   <br />
   This way we make sure we have good test coverage;
4. **Test the behavior, not the implementation**
   <br/>
   So our tests are sutstainable;
5. **Use fact-based names for tests**
   <br />
   The test name should describe what it does, e.g. `include all declared properties` instead how it does it;
6. **Tests as documentation**
   <br />
   The code quality of the tests should be high enough for us to treat them as documentation;
7. **Tests are first class citizens**
   <br />
   All critical paths of code should have test coverage.

## New feature

1. **Show rather than tell**
   <br />
   Create a quick prototype instead of a detailed document to present your idea;
2. **Design before code**
   <br />
   Describe a rough specification to agree on requirements, and then start coding.

## References

- [Bret Victor - Inventing on Principle](https://youtu.be/PUv66718DII?si=xHTk_Tzp5AoSa9Ig)
- [Bret Victor - Media for Thinking the Unthinkable](https://youtu.be/oUaOucZRlmE?si=7jlf2m3PnDHSsrS7)
- [Richard Hamming - You and your research](https://www.cs.virginia.edu/~robins/YouAndYourResearch.html)
