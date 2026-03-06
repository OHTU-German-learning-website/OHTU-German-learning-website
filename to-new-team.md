Hello!

This is a small letter from the previous team that worked on this project during the OHTU course. We had a bit of a difficult time getting started ourselves originally, so we've made an effort to ease your burden a little bit by providing some tips and advice.

Tips:

If you need to learn the technologies here and get some working hours in, you can do the courses Devops with docker or fullstack open, and mark time spent on those as working time for this course too. Two courses with one stone.

Take time to study the architecture of the project in the beginning of the course, instead of prioritising tasks right away.

Do a lot of dailies. If you can't have everyone in the same room, do dailies via video call. If you can't arrange a video call, do dailies by text messages. Just do a lot of dailies.

Don't push code to master on the same day as you have a meeting with the customer. Do it at 18:00 the previous evening at the latest. Then you have time to debug when something innevitably breaks.

For the future:

- Consider adding a second production (staging) environment for testing before pushing to actual production.
- The following things could be improved in the GitHub Actions pipeline:
  - Make the tests faster by for example making e2e-tests run at the same time as other tests.
  - Modify the tests so that the e2e-tests test the built container, not just the code. This way the tests catch if there are problems with for example dependencies marked only as dev-dependencies (since they are removed when the image is built).
- Fix this bug: If you go to the front page and select 'Übungen' from the 'Grammatik' box while you are not logged in you are brought to the login page. If you input valid credentials there and try to log in, you will see that nothing happens.
- Fix this: If you want to see the correct answers to some exercises, you can get the correct answers straight from the API by for example opening https://gradesa-ohtuprojekti-staging.ext.ocp-prod-0.k8s.it.helsinki.fi/api/exercises/dragdrop/1 in your browser. You do not even have to be logged in.

!!! ADHERE TO THE DEFINITION OF DONE !!!

If you have any questions or need to get in contact with a member of the previous team, you can email:

- emil.malk@helsinki.fi
- miika.holmlund@helsinki.fi
