<h1>Hello and welcome to the CLI "Gator" by P3truts!</h1>

<h4>A Command Line Interface Blog AggreGator app that lets you store your favorite RSS feeds and their posts on your own machine!</h4>

This project was created for study during the guided project "Build a Blog Aggregator!" at [boot.dev](https://www.boot.dev/courses/build-blog-aggregator-typescript "Build a Blog Aggregator") using `TypeScript`, `Node.js`, `PostgreSQL`, `Drizzle` and `NVim` as an IDE.

To <b>setup</b> the project:
- clone the repo;
- install typescript, postgre and drizzle-orm for postgres on your machine;
- create a Db using Postgre;
- using drizzle you can create the necessary tables with the already existing migration scripts - in order to do that, please update the drizzle.config.ts file values for connecting to the db with the ones from your machine;

With the setup done, to <b>use the project</b> you need to run CLI commands based on what you want to do, using the <b>"npm run start `<cmd> <arg>`"</b> format. The list of commands below:

- <b>help</b>: displays the list of commands;
- <b>register `<username>`</b>: registers a user in the database;
- <b>login `<username>`</b>: logs a user in the system; only a logged in user can do user cmds;
- <b>users</b>: lists all registered users, marking the <current> logged in one;
- <b>reset</b>: resets all the tables in the Db, effectivelly creating a clean slate for the system;
- <b>feeds</b>: displays all feeds from all the users;
- <b>addfeed `<name> <url>`</b>: adds a feed subscription for the current user;
- <b>follow `<url>`</b>: adds a feed subscription for the current user;
- <b>following</b>: displays all the subscribed feeds for the current user; 
- <b>unfollow `<url>`</b>: unsubscribe a feed for the current user;
- <b>gg `<time_between_requests>`</b>: gets all posts from a feed for the current user; time format: 1ms/1s/1m/1h; recommend using at least several seconds to avoid overwhelming the feeds server;
- <b>browse `<postsNr>`</b>: displays a nr. of posts for the current user starting with the most recent; default posts nr. of 2;

Feel free to play around!

<h6>DISCLAIMER: requires learning how to install and use the aforementioned technologies.</h6>
