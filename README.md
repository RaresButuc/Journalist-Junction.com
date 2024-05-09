# JournalistJunction.com

## Project Description 
"Journalist-Junction.com" is a vibrant and innovative space that encourages creativity and the free expression of ideas. Here, every individual has the opportunity to share captivating stories and unique opinions, covering a wide range of topics - from art and life to technology and crafts. With a diverse and enthusiastic community, Journalis Junction provides a friendly and inclusive environment where writing enthusiasts can develop their talents, share their experiences with the world, and be easily discovered by readers.

//////////////////////////

### Technologies Used

In the development of Trade-My-Skills, we harnessed an array of technologies, each serving a vital role:

- Java with Spring Boot: This combination allowed us to expedite Java application development while enabling the creation of vital APIs and database repositories;

- JavaScript: Utilized to enhance the front-end with dynamic interactivity and creating a user-friendly interface;

- React: Renowned for its capacity to construct interactive and dynamic UI components, React served as our primary library for web application development.

- PostgreSQL: Acting as our primary database management system, PostgreSQL ensured efficient data storage and retrieval.

- Postman: Facilitated API testing and validation, ensuring the reliability and functionality of our APIs.

- Bootstrap: For creating impressive and responsive styling, ensuring a visually appealing and user-friendly design.

### Challenges

During development, we encountered a few challenges that managed to teach us important lessons, including:

- Working with Complex Entities and the Relationships Between Them;

- Fetching Inside Backend.

- Learning and Working With S3(AWS);

### Future Plans
Our future plans for "Journalis-Junction.com" platform include:

- Including "little cards" on the Home Page that will Contain the Latest News depending on the country of the logged or unLogged User.

- Possibility for the creator of the Article to include new contributors.

- Paid Subscription Plans for Viewers: The Paid Subscription option will make possible for a speciffic journalist viewers to be able to read some private or subscription-only articles.
- 
## Setup

### Backend Setup:

1. **Prerequisites:**
    - Ensure you have the latest LTS (Long Term Support) version of Java Development Kit (JDK) installed on your system.
    - If needed, reload Maven dependencies by right-clicking the `pom.xml` file and selecting "Maven -> Reload Project."
    - Create an SQL Database called "journalistjunction" and inside "resources -> application.properties" enter your spring datasource password
    - 
//////////////////////////

2. **Run the Server:**
    - Start the backend server by running the `MainApplication` class.
    - The server should now be up and running.


    ### Frontend Setup:

1. **Prerequisites:**
    - Make sure Node.js is installed and properly configured on your system.

2. **Install Dependencies:**
    - Navigate to the `Frontend` directory in your terminal.
    - Run the following command to install the necessary dependencies:
      ```
           npm install
      ```

3. **Run the Frontend:**
    - Once the dependencies are installed, run the following command to start the frontend:
      ```
           npm run start 
      ```

    - Click on the link provided in the terminal to open the page and experience "Journalist-Junction.com"!
  


## Pages

- Home

While scrolling down you can see the 5 newest articles on every category. You can read their titles, thumbnail descriptions, thumbnail image and see the categories they are included in.

There are 3 posibilities regarding these sections:
a. If a category currently has more than 5 articles, down below the 5th article,there will be a button that will help us redirect to see a list of all articles included in that category;

///////////////////

b. If a category has less than 5 articles in total,there will be shown only these ones,without the button mentioned earlier;

/////////////////////

c. If a category doesn't have any article included in it, this message could be seen;

/////////////////////

Also,in the near future there will be 2 more sections on the right of the screen: a mini-weather app and mini-cards below it containing recent news regarding the country the user is from;

- Trending

This page will display the articles with the most views, related to the most recent period when they were posted (In short, the articles that received the most interest in the last days/last week);

- Search an Article

Click the `Search an Article` navbar-button to acces the page where all the articles are listed;

/////////////////////

a. Every article can be filtered by a category mentioned above:

/////////////////////

b. Articles can be filtered by the language or the location set for the articles:

/////////////////////

c. Articles can be find by title using the keyword mentioned in the input:

/////////////////////

d. All articles available dependng on the sorting,filtering or keywords criterias will be shown on the screen. Also, you will be able to search throw all of them using the pagination below:

/////////////////////

- Click the `Become a Member` navbar-button to register into the webisite(all fields must be completed).

/////////////////////

- Click the `Log In` navbar-button to log into the webisite.
  
/////////////////////

Once logged into the website,as a user,you have acces to the following buttons:

/////////////////////

- `Profile` Page,where everyone can see informations about you(In the future, the users will be able to add social media platforms for a better connection with their audience);

/////////////////////

- `Post New Article` Page is you general Control Panel where you can see every project you started. A button that stands out is the one on the right,that, once pressed, will initialize a new project and will redirect you to the edit page of that article;

/////////////////////

-- `Edit` Page is an individual page for every article started,that represents the control panel of any of these entities. This offers us all the neccessary tools to add all kinds of informations in it,from simple text,to high quality photos. Also,you have to add informations like the language of the article,and the location where it was written from or the place it is about. Those kind of data will help the article to be easily filtered and found by people interested in the topic of it,and looking for a specific language or zone;

////////////////////

