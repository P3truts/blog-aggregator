Hello and welcome to the CLI "Gator" by P3truts!

A Command Line Interface Blog AggreGator app that lets you store your favorite RSS feeds and their posts on your own machine!

This project was created for study during the guided project "Build a blog aggregator!" at boot.dev: https://www.boot.dev/courses/build-blog-aggregator-typescript using TypeScript, Node.js, PostgreSQL, Drizzle and NVim as an IDE.

To setup the project please clone the repo, install typescript, postgre and drizzle-orm for postgres on your machine. Create a Db using Postgre. Using drizzle you can create the necessary tables with the already existing migration scripts - in order to do that, please update the drizzle.config.ts file values for connecting to the db with the ones from your machine.

With the setup done, to use the project you need to run CLI commands based on what you want to do, using the "npm run start <cmd> <arg>" format. The list of commands below:

- help: displays the list of commands;
- register <username>: registers a user in the database;
- login <username>: logs a user in the system; only a logged in user can do user cmds;
- users: lists all registered users, marking the <current> logged in one;
- reset: resets all the tables in the Db, effectivelly creating a clean slate for the system;
- feeds: displays all feeds from all the users;
- addfeed <name> <url>: adds a feed subscription for the current user;
- follow <url>: adds a feed subscription for the current user;
- following: displays all the subscribed feeds for the current user; 
- unfollow <url>: unsubscribe a feed for the current user;
- agg <time_between_requests>: gets all posts from a feed for the current user; time format: 1ms/1s/1m/1h; recommend using at least several seconds to avoid overwhelming the feeds server;
- browse <postsNr>: displays a nr. of posts for the current user starting with the most recent; default posts nr. of 2;

Feel free to play around!

DISCLAIMER: requires learning how to install and use the aforementioned technologies.
