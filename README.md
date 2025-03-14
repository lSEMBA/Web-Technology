
# **Web Technology Project**

[![License](https://img.shields.io/badge/license-MIT-green)](#license)



#### **Technologies Used**
This project utilizes the following technologies:
- **Frontend:**
  - [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
  - [![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
  - [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- **Backend:**
  - [![Django Version](https://img.shields.io/badge/Django-5.1.4-blue)](https://www.djangoproject.com/)
- **Database:**
  - SQLite3




## **Overview**
This project is a web application developed as part of the **Web Technology** course at the Faculty of Computers and Artificial Intelligence, Cairo University. It demonstrates the core concepts of web development using the Django framework. The application integrates user management, media handling, and dynamic content rendering, providing a solid foundation for building modern web applications.

## **Features**
- **User Management:** Login, logout, and account management.
- **Media Support:** Uploading, storing, and displaying images/files.
- **Admin Interface:** Ready-to-use Django Admin dashboard for managing data.
- **Dynamic Content Rendering:** Templates and views to serve dynamic web pages.
- **Security Features:** Includes CSRF protection, Clickjacking Protection, and more.

---

## **Table of Contents**
1. [Requirements](#requirements)
2. [Installation](#installation)
3. [Project Structure](#project-structure)
4. [Configuration](#configuration)
5. [Running the Application](#running-the-application)
6. [Deployment](#deployment)
7. [License](#license)

---

## **Requirements**
To run this project, you need the following:
- Python 3.8 or higher
- Django 5.1.4
- SQLite3 (used as the default database)

### **Installing Dependencies**
Install all dependencies using pip:
```bash
pip install -r requirements.txt
```

---

## **Installation**

### **Step 1: Clone the Repository**
```bash
git clone https://github.com/yourusername/Web-Technology-Project.git
cd Web-Technology-Project
```

### **Step 2: Set Up Virtual Environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### **Step 3: Install Dependencies**
```bash
pip install -r requirements.txt
```

### **Step 4: Apply Migrations**
```bash
python manage.py migrate
```

### **Step 5: Create a Superuser**
```bash
python manage.py createsuperuser
```

---

## **Project Structure**
```
Web-Technology-Project/
├── media/                         # Images
│   ├── avatars/                   # avatars profile
│   ├── images/                    # images 
│   └── products/                  # products images
├── myapp/                         # Main Django application
│   ├── admin.py                   # Admin model definitions
│   ├── apps.py                    # Application settings
│   ├── models.py                  # Database models
│   ├── urls.py                    # Application URL routing
│   └── views.py                   # View logic
├── Salah/                         # Project settings
│   ├── settings.py                # Django settings
│   ├── urls.py                    # Main URL routing
│   ├── wsgi.py                    # WSGI Configuration
│   └── asgi.py                    # ASGI Configuration
├── static/                        # CSS, JS
├── templates/                     # HTML files
├── db.sqlite3                     # SQLite database
├── manage.py                      # Django management script
├── docs/                          # Documentation and resources
│   ├── Phase_1.pdf                # Phase 1 documentation
│   ├── Phase_2.pdf                # Phase 2 documentation
│   ├── Phase_3.pdf                # Phase 3 documentation
│   └── Project1_Participants.pdf  # List of project participants
└── README.md                      # This file
```

---

## **Configuration**

### **Environment Variables**
- **SECRET_KEY:** Must remain secret in production environments.
- **DEBUG:** Set to `False` in production environments.
- **ALLOWED_HOSTS:** Update to include your server domains.

### **Database**
The project uses SQLite as the default database. You can switch to PostgreSQL or MySQL by updating the `settings.py` file.

---

## **Running the Application**
To run the local server:
```bash
python manage.py runserver
```
Open your browser and navigate to:
```
http://127.0.0.1:8000/
```

Admin interface:
```
http://127.0.0.1:8000/admin/
```

---

## **Deployment**
To deploy the project on a production server:
1. Disable debug mode (`DEBUG = False`) in `settings.py`.
2. Configure `ALLOWED_HOSTS` to include your domain.
3. Collect static files:
   ```bash
   python manage.py collectstatic
   ```
4. Use a service like Heroku, AWS, or DigitalOcean to deploy the application.

---

## **License**
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## **Contributing**
If you'd like to contribute to this project, you can:
1. Open an Issue to discuss a problem or suggestion.
2. Submit a Pull Request after making improvements.

---

## **Contact**
- Email: salah.biruty200891@gmail.com
- GitHub: [lSEMBA](https://github.com/lSEMBA)

---

**Note:** This project was developed as part of the **Web Technology** course at the Faculty of Computers and Artificial Intelligence, Cairo University. It serves as an educational demonstration of web development principles using Django.

---

### **Final Note**
This `README.md` file provides a comprehensive overview of the project and guides potential developers and collaborators on how to get started with it. 🚀

---

### **Acknowledgments**
Special thanks to the instructors and teaching assistants of the **Web Technology** course for their guidance and support throughout the development of this project.

