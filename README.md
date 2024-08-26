# Journalist-Junction.com

## Project Description 
"Journalist-Junction.com" is a vibrant and innovative space that encourages creativity and the free expression of ideas. Here, every individual has the opportunity to share captivating stories and unique opinions, covering a wide range of topics - from art and life to technology and crafts. With a diverse and enthusiastic community, Journalis Junction provides a friendly and inclusive environment where writing enthusiasts can develop their talents, share their experiences with the world, and be easily discovered by readers.

![1](https://github.com/user-attachments/assets/8014bce5-2b67-4eee-81cf-9c8ab38cea73)

### Technologies Used

During the the development of "Journalist-Junction.com", we harnessed an array of technologies, each serving a vital role:

- Java with Spring Boot: This combination allowed us to expedite Java application development while enabling the creation of vital APIs and database repositories;

- JavaScript: Utilized to enhance the front-end with dynamic interactivity and creating a user-friendly interface;

- React: Renowned for its capacity to construct interactive and dynamic UI components, React served as our primary library for web application development.

- S3 (AWS): This service is the foundation of the functionality to post different photos on articles;

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
  
## Setup

### Backend Setup:

1. **Prerequisites:**
    - Ensure you have the latest LTS (Long Term Support) version of Java Development Kit (JDK) installed on your system.
    - If needed, reload Maven dependencies by right-clicking the `pom.xml` file and selecting "Maven -> Reload Project."
    - Create an SQL Database called "journalistjunction" and inside "resources -> application.properties" enter your spring datasource password
     
![2](https://github.com/RaresButuc/Journalist-Junction.com/assets/116391767/02d0e02a-a39c-4bfd-b97a-20642058b359)

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

- **Home**

While scrolling down you can see the 5 newest articles on every category. You can read their titles, thumbnail descriptions, thumbnail image and see the categories they are included in.

There are 3 posibilities regarding these sections:

a. If a category currently has more than 5 articles, down below the 5th article,there will be a button that will help us redirect to see a list of all articles included in that category;

![3](https://github.com/RaresButuc/Journalist-Junction.com/assets/116391767/0992d4a2-1b22-4154-a215-3fbe5aaa349b)

b. If a category has less than 5 articles in total,there will be shown only these ones,without the button mentioned earlier;

![4](https://github.com/RaresButuc/Journalist-Junction.com/assets/116391767/0c26301a-e2f5-4e95-8078-3593b2c474c3)

c. If a category doesn't have any article included in it, this message could be seen;

![5](https://github.com/RaresButuc/Journalist-Junction.com/assets/116391767/db0014ad-0abb-40e9-87e8-1bccc65a59a8)

Also,in the near future there will be 2 more sections on the right of the screen: a mini-weather app and mini-cards below it containing recent news regarding the country the user is from;

&nbsp;

- **Trending**

This page displays all the articles with the most views, related to the period of time and the category the reader is interested in (In short, the articles that received the most interest in the last days/last week(s));

![4](https://github.com/user-attachments/assets/a1158f95-a959-4bf0-ba60-a237ff7fca4d)

&nbsp;

- **Search an Article**

This page will give you acces to all the public articles listed on the website;

![2](https://github.com/user-attachments/assets/4d22731a-149f-4a93-83b8-5a5a39b0aa7d)

a. Every article can be filtered by a category mentioned above:

![7](https://github.com/RaresButuc/Journalist-Junction.com/assets/116391767/3805d6e7-438c-4e8e-a03c-7d2efef95057)

b. Articles can be filtered by the language or the location set for the articles:

![8](https://github.com/RaresButuc/Journalist-Junction.com/assets/116391767/556ed366-0b59-4fd3-a374-9cc5374e7abe)

c. Articles can be find by title using the keyword mentioned in the input(in case you want to reload all the filters to the default state,press the "Reset All Filters" button):

![9](https://github.com/RaresButuc/Journalist-Junction.com/assets/116391767/dbf2424e-21cf-401c-9ac0-efab2fb7bb3f)

d. All articles available dependng on the sorting,filtering or keywords criterias will be shown on the screen. Also, you will be able to search throw all of them using the pagination buttons below:

![3](https://github.com/user-attachments/assets/47316355-1b70-4ffa-bc77-47c8245414bb)

![10 1](https://github.com/RaresButuc/Journalist-Junction.com/assets/116391767/0d934a5c-7fc3-4353-ad12-1db78649232f)

&nbsp;

- **Become a Member**

Throw this page you will be able to register into the website. All the 3 photos represent the entire form.

![8](https://github.com/user-attachments/assets/99dd7ae6-cb67-4c3c-bb2e-0dc446ec975a)
**The fields you see above represent the basic informations that should be completed by every user. They can't be "null", but can be modified;**

&nbsp;

![9](https://github.com/user-attachments/assets/b36ddf13-6199-40c8-be24-67a47a605f40)
![11](https://github.com/user-attachments/assets/b0c21d80-a408-442c-83c9-5fc5357a2fcb)
**These 2 inputs help the user upload the profile image and background image. The profile image maximum size is 1400 x 1400 px. The background image should at least has the size of 2100 x 423 px. After dropping it on the input, a crop window will open and will help you cut the image and select the favourite part to display on the profile page;**

&nbsp;

![10](https://github.com/user-attachments/assets/8ca89674-d4c5-492f-82de-6fc797fb9ddf)
**These 3 inputs obviously aren't mandatory, but in case you will complete them, the informations will appear on the profile page next to the platform's icon;**

&nbsp;

- **Log in**

Throw this page you will be able to log into the website.
  
![12](https://github.com/RaresButuc/Journalist-Junction.com/assets/116391767/11f4d15f-2703-4f87-bd23-d4f0138e5961)

Once logged into the website,as a user,you have acces to the following buttons:

![5](https://github.com/user-attachments/assets/a119bb03-ea97-4ac9-8598-71ee087490de)

&nbsp;

- `Profile` Page, where everyone can see informations about yourself. Also, you can subscribe to other channel, and obvously you can't subscribe to your own one.

![7](https://github.com/user-attachments/assets/9017e0fa-dc6a-47f4-939a-800b32b03cf0)
**(Your own channel)**

&nbsp;

![6](https://github.com/user-attachments/assets/79a5295c-6f4c-4db3-a104-ce7cca756c3d)
**(Other people's channel)**

As you can see, you can see in the second image, in case you didn't choose any profile or background image, it will use some default ones until you will decide. Under the profile image are listed informations about yourself, contact data and social media links in case you've got any.
And last, but not least, from this point it starts the channel's articles section, where are listed all the user's articles in chronological order (from the newest to the oldest), using an "Infinite Scroll" library that makes the scrolling more enjoyable and smoother by not loading all the data instantly on the page.

&nbsp;

- `Post New Article` Page is you general Control Panel where you can see every project you started or you are set as a contributor. A button that stands out is the one on the start,that, once pressed, will initialize a new project and will redirect you to the edit page of the new created article. Every card represents a link to the "Edit Page" of the specific article. This page is splitted into 2 parts:

 1. **The Owned Articles**
![12](https://github.com/user-attachments/assets/0e6cb7e3-8b2c-4b1f-8676-3ce1b18180ff)

&nbsp;

2. **The Contributed Articles**
![13](https://github.com/user-attachments/assets/64daddb3-4ae3-492f-be8d-0618c82bce77)

&nbsp;

- `Edit` Page is an individual page for every article started,that represents the control panel of any of these entities. This offers us all the neccessary tools to add all kinds of informations in it,from simple text,to high quality photos. Also,you have to add informations like the language of the article,and the location where it was written from or the place it is about. Those kind of data will help the article to be easily filtered and found by people interested in the topic of it,and looking for a specific language or zone. An important aspect is that this page is different depanding on the status of the user(wheter is it the **owner** or a **contributor**)

1. **Owner POV**
   ![14](https://github.com/user-attachments/assets/ec9892a6-0b93-434a-9047-c4b9000f8944)

&nbsp;

2.  **Contributor POV**
   ![15](https://github.com/user-attachments/assets/1451ed2c-cf9f-407a-b949-1ed24615ed0a)
As you can see the differences between the two, are related with the possibility to delete and publish the article, and the input where the owner can write the email of the desired contributor, and invite him/her through an email message. Also, the owner has the possibility to delete any contributors; 

&nbsp;

- `Read` Page is the final result after finishing and publishing an article. If an article is not officially published,it can't be seen, even if all the necessary fields were completed:

![17](https://github.com/RaresButuc/Journalist-Junction.com/assets/116391767/77fc9be9-65b3-450e-b5ac-458af8fa9921)
![18](https://github.com/RaresButuc/Journalist-Junction.com/assets/116391767/e61900b2-f69f-412b-8553-62fef3bc609a)

If the article contains any other photos,besides the thumbnail one, they can be accessed at the end of the article,and be seen and reviewed at their natural size individually:

![19](https://github.com/RaresButuc/Journalist-Junction.com/assets/116391767/ce702d49-298a-4acc-a2a8-290e9a0e93b9)
![20](https://github.com/RaresButuc/Journalist-Junction.com/assets/116391767/5a348ec1-1ab6-4372-bee2-aa684d79beb2)

