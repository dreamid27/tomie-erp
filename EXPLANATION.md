### Page Implementation

- I built two main pages: the **Quotation** page and the **Sales Orders** page. On the Quotation page, I implemented basic tab-based filtering by status, based on the assumption that the number of quotations created by a user would be relatively small—so advanced filtering or search features were unnecessary.
- I did not implement a sorting feature on this page, as it was deemed unnecessary at this stage.
- On the Create Quotation page, I used `zod` and `react-hook-form` for form validation. Additionally, if the user is logged in as a customer, the customer input field will be pre-filled automatically with the data from the logged-in user.

---

### Design Trade-Offs

- I chose React for the frontend based on the assumption that it is widely used and familiar to most developers. Additionally, it has a vast ecosystem with numerous libraries and a large community, making it easier to find solutions when encountering errors.

- For the backend, I selected NestJS because I’m more familiar with Node.js and Express. NestJS also offers a wide range of libraries that simplify development, along with comprehensive documentation. While Golang could have been a better option performance-wise, it would require more time for me to ramp up due to limited familiarity—especially under tight deadlines. Although Golang is superior in terms of raw performance, I believe that performance is not the primary concern for this project at this stage.

- I also chose Tailwind CSS and ShadCN UI because I’m more experienced with them, and they offer a good balance of flexibility and ease of use. Compared to building components or styling from scratch using custom CSS or CSS-in-JS, these tools significantly speed up development. Moreover, they still allow for customization when needed.

---

### Folder Structure

- In the frontend, I created a `components` folder to store reusable components used across all pages. I further organized components into feature-specific subfolders. For example, a `quotation` folder holds all components related to the quotation page, making it easy to identify which components are used specifically for quotations and which are shared globally.

---

### Future Improvements

- Add a search feature for products and customers, especially useful when the dataset grows large.
- Implement offline data storage to temporarily store user input locally. This can help improve reliability and speed when submitting data.
- **Vertical scaling**: Increase server RAM and CPU resources to handle heavy processing during peak loads.
- **Horizontal scaling**: Add more servers and implement a load balancer to distribute traffic when the user base increases.
- Introduce **rate limiting** to restrict the number of requests a user can make in a given period, helping to prevent abuse and brute force attacks.
- Set up a **queuing system** to manage and process requests in sequence during high-load conditions.
- Enable **caching** for static or infrequently changing data to improve overall performance.
- Implement **monitoring and logging** tools to track server health and identify runtime errors effectively.
