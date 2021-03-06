This is the front end code for the Coordinate Commons application (https://www.coordinatecommons.com/app)

It's still in the very early stages. Read https://www.coordinatecommons.com/app/ and click About in the top bar for more infomation on what Coordinate Commons is.

From a technical perspective - this repo is a React application that also use the Google Maps Javascript API. It was started with create-react-app, and uses react-scripts to build and pacakge everything. The produced artifacts are then pushed to an S3 bucket for www.coordinatecommons.com that is mapped to a Cloudfront distribution. I manually run builds from my local machine. I'll be writing lambdas for the back end functionality and utilizing DynamoDB. Users and login sessions are managed with AWS Cognito. The back end is lambdas called through API Gateway, with DynamoDB for storage (DynamoDB not yet implemented). This uses the full AWS serverless stack. You can see the back end code at https://github.com/brentsowers1/coordinatecommons-backend.

I'm doing this to get more hands on coding experience with React, and more hands on experience with lambdas, node, and AWS technologies. I am a software engineering manager, and have written much code in my years. In the past 5+ years I've managed teams that are building functionality in React, and have managed teams that are doing a few things with lambdas. But I only have a little direct hands on experience coding myself with React, and haven't build any lambdas myself, so I'm doing this project to learn more about those technologies, and to have some fun coding! 

To read more about me, visit https://www.coordinatecommons.com.
