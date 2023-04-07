# ddd-hexagonal-cqrs-es-eda

[![Node.js CI](https://github.com/bitloops/ddd-hexagonal-cqrs-es-eda/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/bitloops/ddd-hexagonal-cqrs-es-eda/actions/workflows/main.yml) ![GitHub](https://img.shields.io/github/license/bitloops/ddd-hexagonal-cqrs-es-eda) ![GitHub issues](https://img.shields.io/github/issues/bitloops/ddd-hexagonal-cqrs-es-eda) [![Dependabot](https://badgen.net/badge/Dependabot/enabled/green?icon=dependabot)](https://dependabot.com/)

Complete working example of using Domain Driven Design (DDD), Hexagonal Architecture, CQRS, Event Sourcing (ES), Event Driven Architecture (EDA), Behaviour Driven Development (BDD) using TypeScript and NestJS.


![ddd-hexagonal-cqrs-es-eda](https://storage.googleapis.com/bitloops-github-assets/ddd-hexagonal-cqrs-es-eda-2.gif)

# Table of Contents

- [I. Introduction](#i-introduction)
  - [Overview](#overview)
  - [Todo application business requirements](#todo-application-business-requirements)
- [II. Technologies and Technical Features](#ii-technologies-and-technical-features)
  - [Technical Features](#technical-features)
  - [Technologies Used - Overview](#technologies-used---overview)
- [III. Quick start - running the ToDo App](#iii-quick-start---running-the-todo-app)
  - [Prerequisites](#prerequisites)
  - [Running the app](#running-the-app)
- [IV. Design Process and Decisions](#iv-design-process-and-decisions)
  - [Design Process - Event Storming](#design-process---event-storming)
  - [Design Decisions](#design-decisions)
- [V. Running in development mode](#v-running-in-development-mode)
  - [A. Project Setup](#a-project-setup)
  - [B. Application Validation](#b-application-validation)
  - [C. Understanding the project structure](#c-understanding-the-project-structure)
- [VI. Conclusion](#vi-conclusion)
  - [❓ Questions](#-questions)

# I. Introduction

Building complex software is really hard, and we learnt the hard way how important it is to design your software correctly from the beginning! 

There is plenty of information out there on how to build resilient and maintainable software, but the difficulty is actually implementing it. So we went ahead and built a comprehensive example we wish we had when we started learning these concepts and technologies. 

Our team has put a lot of effort into creating a clean, and modular code-base that comes as close as possible to production ready code, aiming to provide valuable insights into advanced software architecture concepts. 
 
## Overview
The objective of this project is to provide you a reference implementation on how to design and create maintainable and flexible software applications.

The code is written using Typescript and NodeJS, using the NEST framework, however, the concepts and patterns used are not bound to any specific technologies.

The project includes an over-engineered ToDo app that includes the patterns and principles that are necessary if you want your code to be easy to change, resilient and easy to maintain. Below we provide detailed instructions on how to run it

In addition, you will learn a great deal about software design and architecture patterns and principles such as: 
- Hexagonal Architecture (or Ports and adapters)
- Domain Driven Design (DDD) and its tactical patterns
- Behaviour Driven Development (BDD)
- Event Driven Architecture (EDA) 
- Command and Query Responsibility Segregation (CQRS)
- Eventual consistency
- Event Storming

There are many ways to implement these, so we're eager to get your feedback and open to answer any questions you may have. Join our [Discord](https://discord.com/invite/vj8EdZx8gK) channel if you'd like to exchange some ideas on software design & development or if you have any questions. 

## Todo application business requirements

The todo application, is basically a simple todo application, with some tweaks.

The users should be able to register to the todo app. After they register, they should be able to login. 
After logging in, they should be able to add todos, to complete a todo, to uncomplete a todo (in case they made it complete accidentally), as well as modify the todo title. In the whole process they should be able to view his todos.

When a todo is completed, if this is the first completed todo, an email should be sent to the user to congratulate him for completing his first todo. This operation has to do mostly with the needs marketing team.

# II. Technologies and Technical Features 


## Technical Features 

* **Observability**
* **Realtime client events**
* **Logging**
* **Tracing**: Tracks requests that span through multiple modules/microservices
* **Easy switching between modular monolith and microservices**
* **Authentication**
* **Authorization** (Even at the repository level)
* **Automatic JWT renewal**
* **gRPC query caching**
* **Automatic client code generation using gRPC**

## Technologies Used - Overview
Here are listed some of the specific technologies used for the implementation of the project:
* **Authentication**: [JSON Web Tokens - JWT](https://jwt.io/)
* **Databases - Persistence**: [MongoDB](https://www.mongodb.com/), [PostgeSQL](https://www.postgresql.org/)
* **Testing**: [JEST](https://jestjs.io/)
* **External Communication Protocols**: [REST](https://en.wikipedia.org/wiki/Representational_state_transfer), [gRPC](https://grpc.io/)
* **Frameworks**: [ΝestJS](https://nestjs.com/)
* **PubSub technology**: [NATS](https://nats.io/)
* **Message Streaming Technology**: [JetStream](https://docs.nats.io/nats-concepts/jetstream) *by NATS*
* **Container Technology**: [Docker](https://www.docker.com/)
* **Tracing-Observability**: [Jaeger](https://www.jaegertracing.io/), [Grafana](https://grafana.com/)
* **Metrics**: [Prometheus](https://prometheus.io/)
* **API Gateway - Proxy**: [Envoy](https://www.envoyproxy.io/)


# III. Quick start - running the ToDo App

## Prerequisites
In order to run the application the following should have been installed on your local machine:

* **Docker** should be installed ([link](https://docs.docker.com/engine/install/))
* **docker-compose** should be installed, if your docker installation does not install it automatically ([link](https://docs.docker.com/compose/install/))

## Running the app
In order to run the application you need to follow the steps below:
* Run: 
```bash
 git clone https://github.com/bitloops/ddd-hexagonal-cqrs-es-eda.git
```
* Navigate  to the folder: 
```bash
cd ddd-hexagonal-cqrs-es-eda
```

* Run: 

```bash
docker compose -p bitloops-todo-app up -d
``` 
from the terminal inside the project **in order to download and run the necessary containers**.

Then the ReactJS front-end application will be visible at: `http://localhost:3000`.

<p align="center" style="margin-bottom: 0px !important;">
  <img width="400" src="https://storage.googleapis.com/bitloops-github-assets/todo-frontend.png" alt="Frontend application" align="center">
</p>

<p align="center">
Frontend React JS application
</p>

# IV. Design Process and Decisions 

## Design Process - Event Storming

We have chosen the [Event storming](https://www.eventstorming.com/) technique to document the functionality and business logic of the todo application.

In general, [Event storming](https://www.eventstorming.com/) is a **collaborating modelling technique** used to model complex domains, in order to align the software produced with the actual business logic. It matches perfectly with [Domain Driven Design (DDD)](https://bitloops.com/docs/bitloops-language/learning/software-design/domain-driven-design) as well as [Event Driven Architecture (EDA)](https://bitloops.com/docs/bitloops-language/learning/software-architecture/event-driven-architecture). 

If you want to know more for this technique, you can check the **Theoretical Review** at the end.

<p align="center" style="margin-bottom: 0px !important;">
  <img width="900" src="https://storage.googleapis.com/bitloops-github-assets/Todo%20event%20stroming%20new.png" alt="Todo Event Storming" align="center">
</p>

As you can see after the collaborative discovery, we have identified the following **bounded contexts**:

* **IAM**: Has todo with the user registration and log in.
*  **Todo**: This is the **core subdomain** of our application (see [DDD](https://bitloops.com/docs/bitloops-language/learning/software-design/domain-driven-design))
*  **Marketing**: This is a **supporting subdomain** (see [DDD](https://bitloops.com/docs/bitloops-language/learning/software-design/domain-driven-design)) of our Todo application. 

In the process we have further split some bounded contexts (linguistic boundary), to more fine grained modules.

The processes of the system as were discovered are the following:

* **User Log In process** (IAM Bounded Context)
* **User registration process** (IAM Bounded Context)
* **Todo process** (Todo Bounded Context)
* **Onboarding process** (Marketing Bounded Context)

## Design Decisions

Some parts of the system need to have information which is located in other parts of the system. 

More specifically, the Marketing bounded context, **needs to know when a todo is completed** and run its business logic to send an email when the first todo is completed.

Moreover the Marketing Bounded contexts **needs to have information concerning the email** of each specific user, in order to be able to send an email.

The problem in this case is that the email information belongs to the IAM bounded context. So in order for the marketing bounded context to have the knowledge of the specific users's email, either it can make a sync request to the IAM bounded context, or it can listen to integration events from the IAM bounded context, in order to hold a local email information (via [eventual consistency](https://en.wikipedia.org/wiki/Eventual_consistency)).

In this project the decision was to keep a local repository in the Marketing bounded context, of the users and their emails, updated by listening to integration events from the IAM bounded contexts (**user registered** and **user email changed**). 

# V. Running in development mode

## A. Project Setup

### Prerequisites
In order to run the application the following should have been installed on your local machine:

* **NodeJS** should be installed ([link](https://nodejs.dev/en/learn/how-to-install-nodejs/))
* **Docker** should be installed ([link](https://docs.docker.com/engine/install/))
* **docker-compose** should be installed, if your docker installation does not install it automatically ([link](https://docs.docker.com/compose/install/))
* **npm** and or **yarn** should be installed ([npm link](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm), [yarn link](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable))

### Running the app

After all the necessary have been installed on your local machine, you should follow the **steps** mentioned below to run the application:

* Run: 
```bash
 git clone https://github.com/bitloops/ddd-hexagonal-cqrs-es-eda.git
```
* Navigate  to the folder: 
```bash
cd ddd-hexagonal-cqrs-es-eda/backend
```
* Run: 
    ```bash
    yarn install
    ``` 
    if you are using **yarn**  
    or: 
    ```bash
    npm install
    ```
    if you are using **npm**, from the terminal inside the project **to install the necessary packages**.

* **Start docker on your machine**.
* Run 
  ```bash
  docker compose -p bitloops-todo-app up -d
  ``` 
  from the terminal inside the project **in order to download and run the necessary containers**.
* Create a `.development.env` file inside the root project and copy and paste the contents of the `.template-env`, which is located in the root of the project inside it.
* Run: 
    ```bash
    yarn start:dev
    ``` 
    or 
    ```bash
    npm start:dev
    ``` 
    to start the server.

## B. Application Validation

### Test the application is running

In order to test the application is running we could use a client  
The application is using **REST** for the authentication part and **gRPC** for the Todo part.

Those tools could be helpful in the development process as well.

#### Postman

So we recommend to test the application with a client tool that supports both. Such tool could be [Postman](https://www.postman.com/product/what-is-postman/).

You may find tutorials on how to use **Postman** for REST and gRPC requests below:

* REST ([link](https://hevodata.com/learn/postman-rest-client/))
* gRPC ([link](https://learning.postman.com/docs/sending-requests/grpc/first-grpc-request/))

To just test the app is app and running you can just invoke `http://localhost:8082` URI with Post request as shown in the picture below:

<p align="center" style="margin-bottom: 0px !important;">
  <img width="900" src="https://storage.googleapis.com/bitloops-github-assets/app-testing-confirmation.png" alt="App Running Confirmation" align="center">
</p>

<p align="center">
The server should respond with the message shown in the picture
</p>


#### cURL (only for initial testing) 

A faster way to test the app works is to use **[cURL](https://curl.se/)**. In most cases cURL is already installed in your operating system. If not you can download **cURL** [here](https://curl.se/download.html).

To just test the app is app and running you can just run the following command on terminal:

```curl http://localhost:8082/```

The server should respond (in the terminal) with: 
```{"statusCode":404,"message":"Cannot GET /auth/register","error":"Not Found"}```


### Running the application tests

In order to run the tests of the application run the following on the terminal:

`yarn test` or `npm test`.

## C. Understanding the project structure

The main project structure is located at the `/src` folder. 
The starting point for the whole application is the `src/main.ts` file.


<p align="center" style="margin-bottom: 0px !important;">
  <img width="500" src="https://storage.googleapis.com/bitloops-github-assets/project-structure.png" alt="Project Structure" align="center">
</p>

<p align="center">
Project Structure Overview
</p>

The main folders are the following:

* api
* bounded-contexts
* config
* lib
* proto

### API Folder

The api folder contains the **presentation layer** of the application (driving adapters of the infrastructure layer of the [Hexagonal Architecture](https://bitloops.com/docs/bitloops-language/learning/software-architecture/hexagonal-architecture)), containing the **authentication controllers** (REST) as well as the **todo controllers** (gRPC).

It also contains the [Data Transfer Objects (DTOs)](https://en.wikipedia.org/wiki/Data_transfer_object) for those controllers.

The main operation of the **presentation layer (controllers)** is to send **commands** and **queries** via the [PubSub](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) system ([NATS](https://nats.io/) in this case), which will asynchronously invoke the application layer via the **command and the query handlers**- (more information concerning the application layer could be found below).

The application layer (command and query handlers) after executing, they respond to the presentation layer (controllers) via the [Request-Reply pattern](https://natsbyexample.com/examples/messaging/request-reply/go/). 

### Bounded-Contexts Folder

The bounded-contexts folder contains the **data access layer** (driven adapters of the infrastructure layer) - concrete implementations of the ports ([Hexagonal Architecture](https://bitloops.com/docs/bitloops-language/learning/software-architecture/hexagonal-architecture)) of the application, organised by the specific **bounded contexts** ([DDD](https://bitloops.com/docs/bitloops-language/learning/software-design/domain-driven-design)) of the application. These concrete implementations are specific **repository implementations** as well as specific **external service implementations**. 


### Config Folder
Contains the configuration files for the application.

### Lib Folder
Contains the core of the application (inside the `bounded-contexts` sub-folder), containing the **application layer** and the **domain layer** of the application.

The sub-folders (e.g. `bounded-contexts/lib/todo`) represent the exact bounded contexts ([DDD](https://bitloops.com/docs/bitloops-language/learning/software-design/domain-driven-design)) of the application. In our case these bounded contexts represent a conceptual linguistic boundary. 

Inside each subfolder of each bounded context there is another folder which represent the specific module (e.g. `bounded-contexts/lib/todo/todo`). 

In our case each module represents a logical boundary inside the linguistic boundary of the bounded context. This means that one bounded context (linguistic boundary), could have more than one module (logical boundary) inside (see  [DDD](https://bitloops.com/docs/bitloops-language/learning/software-design/domain-driven-design)).

### Module Structure
Each module structure contains the following folders:
* application
* commands
* queries
* domain
* contracts
* ports
* tests

<p align="center" style="margin-bottom: 0px !important;">
  <img width="400" src="https://storage.googleapis.com/bitloops-github-assets/module-structure.png" alt="Project Structure" align="center">
</p>

<p align="center">
Module Structure Example
</p>

#### Application Folder
Represents the **application layer** use cases of the specific module.
In this project we have implemented a flavour of the [CQRS pattern](https://martinfowler.com/bliki/CQRS.html). 
So in general inside this folder reside:
* Command Handlers
* Query Handlers
* Event Handlers (see [Event Driven Architecture](https://bitloops.com/docs/bitloops-language/learning/software-architecture/event-driven-architecture))
* Application Layer Errors

**Event handlers** also belong to the application layer. In general there are two types of event handlers:
* **Input Event Handlers**: They listen to events (domain or integration events) and transform them to commands.
* **Output Event Handlers** : They listen to domain events and transform them to **integration events**. (More on integration events later)

The event handlers are really important, since they help in building loosly coupled systems ([Event Driven Architecture](https://bitloops.com/docs/bitloops-language/learning/software-architecture/event-driven-architecture)).

#### Commands folder
Commands also belong to the **application layer** of the specific module. Commands (see [CQRS pattern](https://martinfowler.com/bliki/CQRS.html))  represent the data structure which triggers the command handlers.

#### Queries folder
Queries also belong to the **application layer** of the specific module. Commands (see [CQRS pattern](https://martinfowler.com/bliki/CQRS.html))  represent the data structure which triggers the query handlers.

#### Domain folder
The Domain folder represents the **domain layer** of the module, containing all the elements of the tactical patterns from [Domain Driven Design (DDD)](https://bitloops.com/docs/bitloops-language/learning/software-design/domain-driven-design). Like: **Value Objects**, **Entities**, **Root Entities (Aggregates)**, **Domain Events**, **Domain Errors** etc. 
This folder also contains **Read Models** (see CQRS) as well as **Rules** which represent a way to express the rules inside the domain elements (Value Objects & Entities). 

#### Contracts folder
Represent the way a specific module communicates with the other modules, in **loosly coupled** way ([Event Driven Architecture](https://bitloops.com/docs/bitloops-language/learning/software-architecture/event-driven-architecture)).

This is being achieved via **integration events** ([link](https://codeopinion.com/should-you-publish-domain-events-or-integration-events/)).

Utilising integration events is the way for a module to communicate to other parts of the system (modules) that something has happened.

Since those integration events could break the operation of some other modules if their contract change (the data inside the integration event), it is **necessary to also include a version**. Each time a change is made to an integration event, a new version is triggered without breaking parts (mostly modules) of the system which listens to the old contracts.

A common way to emit integration events is via **transforming the domain events of the domain layer into integration events**, via event handlers.

#### Ports folder
This folder contains the **interface (see [Hexagonal Architecture](https://bitloops.com/docs/bitloops-language/learning/software-architecture/hexagonal-architecture)) between the application layer and the infrastructure layer** of the application, and more specifically the **data access layer** (adapters for the specific repository concretions as well as external services concretions). 

Those ports are being used as dependencies inside the **application layer** (Command Handlers, Query Handlers and Event Handlers), to achieve the [Dependency inversion principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle) - **D** from [SOLID](https://en.wikipedia.org/wiki/SOLID). Which is the principle which [Hexagonal Architecture](https://bitloops.com/docs/bitloops-language/learning/software-architecture/hexagonal-architecture) uses to achieve plugging different adapters to the same port.


#### Tests folder
This folder contains the use case tests/ or **behaviour driven tests** (from [BDD](https://bitloops.com/docs/bitloops-language/learning/behavior-driven-development)).

These tests are testing the behaviour of the system, which means they **test the business logic** by testing the **application layer** (Command Handlers, Query Handlers).
Testing the business logic via the **application layer**, and not from the **domain layer** (via **unit tests**) helps changing the domain layer frequently **without having to change all the unit tests each time**.

The tests use **mock repositories** and **mock services** as adapters (concretions) of the ports to **emulate actual repositories and services**. This helps to **test the business logic fast**, **without using actual databases and external services** to test the business logic.


### proto folder
This folder contains the proto ([protobuf](https://protobuf.dev/) - protocol buffers) files which are mandatory for defining the [gRPC](https://grpc.io/) interface necessary to setup the **todo** api controllers located at the `src/api` folder. 

Communication via **Protocol Buffers** have many advantages than communicating via JSON since the message sent via the wire is in binary form thus slimmer and they also communicate the data type in a **programming language agnostic way**. To read more  You can read more about them [here](https://en.wikipedia.org/wiki/Protocol_Buffers). 

# VI. Conclusion

Our team is privileged to have had the opportunity to work with such powerful software design patterns and cutting-edge technologies. We've learned a lot over the past few months, and we're excited to share our knowledge with other developers who are passionate about building great software. 

We would love to keep in touch with people that are interested in this subject and have some ideas to share. Catch us on [Discord](https://discord.com/invite/vj8EdZx8gK) if you have any questions or suggestions. 

We would also love to see some contributions!

## ❓ Questions

If you have any questions, clarifications or would like some help on your own project, join our [Discord channel](https://discord.gg/vj8EdZx8gK). We already have a few community members learning and sharing knowledge about software development design patterns.

<p align="center" style="margin-bottom: 0px !important;">
  <img width="600" src="https://storage.googleapis.com/bitloops-github-assets/star-us.gif"
</p>


</br>
</br>

---
# 📚 Theoretical Review

Below is a summary of all the software architecture and design patterns used in the example above from a theoretical perspective. These are all based on available resources, and many references are provided for deeper research. 

## Table of Contents

- [Software Architecture](#software-architecture)
  - [Layered Architecture](#layered-architecture)
    - [Separation of concerns benefits example](#separation-of-concerns-benefits-example)
    - [Limitations of the classical layered architecture](#limitations-of-the-classical-layered-architecture)
    - [Modern Layered Architectures](#modern-layered-architectures)
    - [The Anti-pattern (beware)](#the-anti-pattern-beware)
  - [Hexagonal Architecture (or Clean / Onion Architecture)](#hexagonal-architecture-or-clean--onion-architecture)
  - [Ports And Adapters](#ports-and-adapters)
  - [Driven Adapters vs Driving Adapters](#driven-adapters-vs-driving-adapters)
  - [Inversion of Control](#inversion-of-control)
- [Domain Driven Design (DDD)](#domain-driven-design-ddd)
  - [Key advantages of using DDD](#key-advantages-of-using-ddd)
  - [Strategic and Tactical DDD](#strategic-and-tactical-ddd)
    - [DDD \& Hexagonal Architecture are Complementary](#ddd--hexagonal-architecture-are-complementary)
- [Behavior Driven Development (BDD)](#behavior-driven-development-bdd)
- [Event-Driven Architecture](#event-driven-architecture)
- [Command and Query Responsibility Segregation (CQRS)](#command-and-query-responsibility-segregation-cqrs)
- [Event Sourcing (ES)](#event-sourcing-es)
- [Eventual Consistency](#eventual-consistency)
- [Event Storming](#event-storming)
- [🚀 Bringing this all together!](#-bringing-this-all-together)
- [🙌 Contributing](#-contributing)
- [👨‍💻 Additional learning resources](#-additional-learning-resources)
  - [Articles](#articles)
  - [Blogs](#blogs)
  - [Videos](#videos)
  - [Books](#books)



## Software Architecture
The project is designed with a [layered architecture](https://bitloops.com/docs/bitloops-language/learning/software-architecture/layered-architecture) approach, and more specifically: [Hexagonal Architecture](https://bitloops.com/docs/bitloops-language/learning/software-architecture/hexagonal-architecture) (Ports and Adapters architecture). 


Layered Architecture is a software architecture that is widely used in modern software development. It is a logical and structured approach to designing software that separates different functional modules of an application into four separate horizontal layers, each with a specific set of responsibilities. This separation of concerns makes the code more modular, maintainable, and scalable, and enables easier testing and debugging.

This particular architectural pattern has influenced the development of various other architectural patterns, including:
- [Hexagonal Architecture (also known as Ports and Adapters)](https://bitloops.com/docs/bitloops-language/learning/software-architecture/hexagonal-architecture)
- [Onion Architecture](https://bitloops.com/docs/bitloops-language/learning/software-architecture/onion-architecture) 
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)


These patterns have emerged in response to the need to clarify further the concept of layered architecture, and they have each added their own unique features and benefits. However, all these patterns have in common the goal to provide a more modular, flexible, and maintainable approach to building software systems. 

Therefore, we strongly recommend understanding the core principles of layered architecture and its relationship to these other patterns, as it will help you better understand these other software architecture patterns, and help you make informed decisions about which approach is best suited to your specific needs and requirements.

### Layered Architecture
The use of layers in software is fundamental to obtain what is commonly referred to as [separation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns). This concept is extremely important if we want the confidence to change some elements of a software system without affecting the other components. This separation makes it very easy to understand how a software system works, and how to manage it. 

The layers communicate with each other via abstractions (or contracts). Those contracts in their simple form could be interfaces (in OOP languages).  

The standard layers of a classical layered architecture are:
- **Presentation layer** (also known as UI layer, view layer) -  This layer is responsible for the user interaction with the system. It is responsible for the presentation of the data (e.g. JSON, HTML) and the way of communication with the external world (e.g. REST or gRPC or GraphQL).
- **Application layer** (also known as service layer, use case layer) - Exposes the business functionality to the upper layer. 
- **Business Layer** (also known as business logic layer (BLL), domain logic layer) - implements the core functionality of the system, containing the business logic.
- **Data access layer** (also known as persistence layer) - This layer contains the implementation for the communication between the application and the database. Moreover it can implement the communication between the application and some external service.

</br>
</br>

<p align="center" style="margin-bottom: 0px !important;">
  <img width="500" src="https://storage.googleapis.com/bitloops-github-assets/Eric%20Evans%20DDD%20Layers.webp" alt="Eric Evans DDD Layers" align="center">
</p>

<p align="center">
Eric Evans Layered Architecture - 2003
</p>

</br>
</br>

In practice, when utilizing layered architecture and a request comes in, it passes through all layers **Presentation -> Application -> Business -> Data access** and then back to the presentation layer. 

These layers are arranged in a hierarchical order, and each layer provides services to the layer above it and depends on the layer below. The separation of concerns arises as each layer is responsible for handling specific tasks and has limited communication with the other layers. 

#### Separation of concerns benefits example
Returning back to why to use layered architecture, a simple example could be that if we want to add a gRPC endpoint to the presentation layer invoking the same functionality (service or use case) utilised already by a REST endpoint, we can just create a gRPC endpoint in the presentation layers and make it invoke the same service (or use case) from the application layer.

The key things to consider regarding layered architecture:

- **The dependencies flow downwards.** (e.g. the Presentation layer depends on the Application layer, never the other way around)
- **At the heart of the classical layered architecture lies the Data access layer.** Ultimately, everything depends on the Data Access layer.

#### Limitations of the classical layered architecture
The main limitation of the classical layered architecture is that all layers are dependent on the Data access Layer. Which means that even though it is relatively easy to change the application interface with the outside world (via adding/changing the controller in the Presentation Layer - as mentioned in the example above), it is really hard to change a 

#### Modern Layered Architectures
Given the growth in complexity of applications, interfaces (mobile devices, tablets, IoTs, etc.) as well as the general shift to cloud, the layered architecture has evolved. Whilst it still maintains the core layers, it is now more commonly known as the n-tier and offers a scalable solution. 

</br>
</br>

<p align="center" style="margin-bottom: 0px !important;">
  <img width="700" src="https://storage.googleapis.com/bitloops-github-assets/2010s-layered-architecture-herbertograca.png" alt="Layered Architecture" align="center">
</p>

<p align="center">
Example of a Layered Architecture. Source: <a href="https://herbertograca.com/2017/08/03/layered-architecture/"> humbertograça.com</a>
</p>

</br>
</br>

#### The Anti-pattern (beware)
The Layered Architecture is very intuitive, but beware of creating too many layers and over-complicating the project. It is important to organize a software system by its sub-domains or modules (something we'll see below with DDD), and not solely focused on the layers. 



### Hexagonal Architecture (or Clean / Onion Architecture)
In Hexagonal Architecture (as well as in Clean and Onion), the concept of layers is mostly the same, however, the business (or domain) layer is given a higher priority and placed at the heart of the architecture design. This results in the **Data Access Layer (persistence),** now being placed on the outer "Infrastructure" Layer. 

</br>

<p align="center" style="margin-bottom: 0px !important;">
  <img width="600" src="https://storage.googleapis.com/bitloops-github-assets/hexagonal-architecture-bitloops.svg"
" alt="Hexagonal Architecture" align="center">
</p>

<p align="center">
Detailed Hexagonal Architecture. Source: Bitloops</a>
</p>

</br>
</br>

As you can see in the image above, the Hexagonal Architecture has same 4 layers, which are sometimes grouped into 3 layers, however, the Domain Layer is at the centre, followed by the Application Layer around it, and the final layer being the Infrastructure Layer around it.

So once again, you have the same layers as the Layered Architecture:
- **Infrastructure layer**
   - Presentation Layer
   - Data Access Layer
- **Application Layer**
- **Domain Layer**

Moreover, the flow of dependencies is actually very similar, but this time it goes from the outside to the inside, more specifically from the Infrastructure Layer (which includes Database, User Interfaces, etc.), to the Application layer and then from the Application Layer to the Domain layer. 

Essentially, this means that the Domain Layer does not have any dependency on any of the other layers, allowing it to be simplified and defined exactly as needed.

The combination of the **Application and Domain Layers** is commonly referred to as the **Application Core Layer (or Core Layer)** in relevant bibliography. Below is a brief explanation to each of the main components of the Hexagonal Architecture, but do refer to this [link](https://bitloops.com/docs/bitloops-language/learning/software-design/domain-driven-design) if you want a detailed overview.

### Ports And Adapters
The application core (Domain and Application Layer) which is at the center of the application, needs to be connected to specific concrete technologies of the infrastructure layer (Presentation and Data Access layer).

In order to achieve this whilst maintaining the essence of separation of concerns, two concepts are required: 

- **Ports:** Contracts (Interfaces) to plug in specific concrete implementations. They are essentially a specification of how to use the application core. Ports reside inside the Application Core and is composed of one or more interfaces and data transfer objects (DTOs)
- **Adapters:** Actual implementations of the ports contracts. They are essentially responsible for implementing the code that will allow the Application Core to communicate with the external world.

💡 There could be many adapters for a specific port, which is the reason why you're able to switch or add infrastructure very quickly if your code is setup this way. 

> **Example:** if we have a port for an email service (Data Access layer), and we have already implemented an adapter utilising a specific mail server at the moment (e.g. SendGrid adapter) we could easily create another adapter (e.g. Twilio adapter) which implements the same port utilising a totally different service provider. This requires ZERO changes to the Domain or Application Layer.

With this concept, it is easy to see how we can change database technologies, via creating different adapters for the same database port, or any other external system for that matter. 

### Driven Adapters vs Driving Adapters
Adapters can either be **Driving** or **Driven**. The difference is simply whether the adapters belong to the Presentation (User Interface) or the Data Access layer of the Infrastructure Layer.

- **Driven Adapters:** Belong to the Data Access part of the infrastructure layer
- **Driving Adapters:**  Belong to the Presentation part of the infrastructure layer



### Inversion of Control
The **key difference** between a classical layered architecture and Hexagonal/Clean/Onion architectures, is the **flow of dependencies.** In the Hexagonal Architecture the Adapters depend on a specific tool and a specific port (through an interface), however, the business logic only depends on the port and doesn't depend on any adapter or external tool. So the direction of dependencies is always pointing towards the centre (the Domain Layer)

</br>
</br>

---
## Domain Driven Design (DDD)
DDD is a software development approach or methodology that really focuses on building a deep understanding of a business domain, creating a map or model of the processes and rules of that particular business.

In fact, DDD is not about coding, but its more a philosophy about how to build software for complex domains, and simplifying the the development of systems that solve that domain's problems. 

**In essence, DDD has three core principles:**
- Focus on the core domain and logic to build domain models
- Use the domain model as a base for all software designs
- Collaborate with domain experts to improve the domain model and resolve any emerging domain-related issues

### Key advantages of using DDD
- **Common Language** – DDD promotes the creation of terminology and definitions that everyone understands and uses, and are specific to a project - this is commonly referred to as the **ubiquitous Language**. This may seem trivial, but the improvement in communication between developers and domain experts, as well as between developers themselves, has a huge productivity boost
- **Reliable code** - Applying the DDD concepts leads to cleaner, more reliable code that is easy to test
- **Maintainable code** - Software built with a DDD mindset is easier to understand and change since the code and the business processes are aligned
- **Faster development** - Well structured and organized code allows developers to develop new features, extensions and improvements / iterations much faster


### Strategic and Tactical DDD
Ultimately, DDD helps model software that domain experts understand and agree with, and developers can manage more effectively. It basically provides the bridge between between domain experts (business specialists) and software engineers (Product & Tech).

In order to achieve this, DDD is generally thought of from 2 perspectives:

1. **Strategic: this refers to a higher level modeling of the domain by using a ubiquitous language, breaking up a system into bounded contexts and clearly defining the context maps, ensuring the entire team/organization is aligned.**

2. **Tactical: this is commonly referred to as the building blocks of DDD as it is a bit more spec- ific in nature and helps engineers more clearly define these rules and processes. This includes entities, Value Objects, Services, Repositories, etc. which we explain further below.**


<p align="center" style="margin-bottom: 0px !important;">
  <img width="600" src="https://storage.googleapis.com/bitloops-github-assets/domain_driven_design_tactical_strategic_patterns.png"
" alt="Strategic and Tactical DDD Patterns" align="center">
</p>

<p align="center">
Strategic and Tactical DDD Patterns. Source: <a href="https://www.thoughtworks.com/en-us/insights/blog/architecture/domain-driven-design-in-functional-programming"> thoughtworks</a>
</p>

</br>
</br>

#### Strategic: Building a Domain Model
From a strategic perspective, DDD focuses on understanding the domain and building an accurate model. To achieve this, 4 key concepts need to be understood: 

Explaining 4 key components of DDD is necessary:

- **Domain / Subdomains:** A domain is the heart of any organization, and is a set of rules, requirements, processes and guidelines that define how an organization interacts with its customers, partners, suppliers and any other relevant stakeholders. There are 3 types of subdomains, and each has a different priority level:
-- **Core Domain:** This is the domain that makes this product unique and adds the most value to its users. It has the highest priority and focuses and on what the organization really needs to excel at. 
-- **Supporting Domain:** This domain supports the overall project, but is not critical. There may be some customization, but its not something unique to the project
-- **Generic Domain:** These domains can easily be outsourced or provided by a standard market solution. There is no special feature or uniqueness

- **Ubiquitous Language:** This encompasses all the terms and words used to define the domain model, and is generally created through collaboration with domain experts. This language is then used by all team members when discussing activities related to the team’s application.
- **Bounded Contexts:** This is a conceptual boundary that contains parts of an application that fit into a specific model. Its typically a subsystem or the work of a specific team and revolves around a specific business domain.
- **Context Mapping:** This basically defines how bounded contexts interact and communicate with each other. Having clarity on the boundaries as well as the collaboration expectations will improve greatly the quality and speed of product development.

&nbsp;

#### Tactically: Implementing DDD
The tactical patterns deal with the actual implementation once a domain model has been defined. One of the first principles is the use of a Layered Architecture (in this case a Hexagonal Architecture) to ensure the code not be intertwined with different functionalities. Separating the domain logic from all other functionality reduces confusion in large and complex systems.

- **Events:** Events allow systems to be designed with reduced coupling between components. Generally, events represent an important business event in the domain and are represented with specific ubiquitous language. They are used in a publish-subscribe manner to trigger other commands or services and can be considered:
    - **Domain events:** used within a specific bounded context and can reference domain objects, and are commonly used to synchronize state of different aggregates or subscribe to events in the application services and perform infrastructure related tasks.
    - **Integration events:** are events used to synchronize between bounded contexts, particularly useful when building microservices. These events cannot reference domain objects, usually contain only identifiers of all aggregates which changed state and should use simple types so other systems are able to interpret them. These events are part of the published (not ubiquitous language), meaning changes could impact external systems.
- **Entities:** These represent concepts in the domain problem that have a unique identity (which does not change over time) and have a life cycle. Entities are composed of value objects and relation to other entities. 
- **Value objects:** These objects are the basic building blocks of any domain model and define important concepts. THey are immutable and replaceable, and unlike entities, have no lifecycle. The lack of value objects may indicate that the entities are overloaded with responsibilities.
- **Aggregates:** This is probably the most powerful tactical pattern as Aggregates divide bounded contexts into smaller groups of classes, where each group represents concepts closely related to each other that work together. This ensures high-cohesion of a software system. 
- **Factories:** In order to create a new object, Factories are built with a single responsibility: create other objects. The reason Factories are used is that it provides encapsulation given an interface is created to simplify the object creation process, and makes it also easier to change in the future. 
- **Domain Invariant:** The policies and conditions that must always be met in a specific context, as well as what is possible and what is prohibited in the context is defined by Domain Invariants.
- **Domain Error:** Errors will occur and a well-defined domain layer makes it much easier to detect errors and return an explicit error types, rather than throwing the session and not returning an error.
- **Domain Service:** A Domain Service is used to encapsulate domain logic and represent business concepts when multiple entities or value objects have a shared responsibility. THey basically orchestrate entities and value objects.
- **Data Transfer Object (DTO):** A DTO is a special type of class that represents data that comes from external applications, carries data between processes & defines contracts between them. 
- **Application Service:** In order to orchestrate the necessary steps to complete an operation by a user, Application Services (also known as workflow services, use cases or interactors) as used to manage the communication across the entire application. 
- **Command:** A Command will change data within a system and indicates an intention by a user. 
- **Queries:** A Query only retrieves data from a system without making any changes. Understanding these two concepts is important to understand CQRS explained further below. 
- **Repository:** All the code that handles operations over aggregates (entities and value objects) is placed in a repository. It provides an intermediary between the domain model and the data mapping. 

The above is a summary of DDD and its benefits, however, there are many detailed posts, articles and videos about Domain Driven Design. This [reference document](https://bitloops.com/docs/bitloops-language/learning/software-design/domain-driven-design) has a comprehensive overview.


### DDD & Hexagonal Architecture are Complementary
Domain-driven design and hexagonal architecture go hand in hand given that DDD tactical patterns can be implemented inside the Domain Layer of Hexagonal Architecture. 

The goal of DDD is to build software systems that are closely aligned with the business needs and focus on modularity (separation of concerns), a common language and the creation of a domain model that is easy to understand, maintain, and modify over time. It really focuses on building a create Application Core (domain and application layers)

The goal of hexagonal architecture is to ensure the entire application works well and serves its users in the best way possible, using (and changing) technologies when necessary. The focus is on building systems that are modular, testable, and maintainable

Combining DDD and hexagonal architecture is not easy (we believe the above domain framework makes it much easier), and there are many advantages: 

</br>
</br>

---
## Behavior Driven Development (BDD) 
[BDD](https://bitloops.com/docs/bitloops-language/learning/software-design/behavior-driven-development), also known as Behavioral Testing, is all about connecting the technical teams with the business teams manage, map and test the external behaviour of the system. 

The focus is on the expected behavior of the system, and it helps non-technical team members to get a clear picture of the software development process and describes in-depth the expected outcomes. With this focus, there is a higher chance of delivering value to the business as it allows teams to identify and address issues early in the development process. 
</br>
</br>
<p align="center" style="margin-bottom: 0px !important;">
  <img width="600" src="https://storage.googleapis.com/bitloops-github-assets/behavior-driven-development-cycle-what-is-bdd.png"
" alt="Behavior Driven Development BDD" align="center">
</p>

<p align="center">
Behavior Driven Development (BDD). Source: <a href="https://brainhub.eu/library/behavior-driven-development"> BRAINHUB</a>
</p>

</br>
</br>


Like DDD, BDD emphasizes collaboration between developers and business stakeholders, reducing the risk of errors and issues in production. In fact, BDD and DDD are often combined during development processes to test the behaviour of the application layer (use cases), as well as unit tests that focus on specific domain elements but change a lot faster.

In addition, BDD is commonly used with [Test-Driven Development (TDD)](https://bitloops.com/docs/bitloops-language/learning/software-design/test-driven-development), which is essentially a software development process, similar to BDD, that encourages developers to build test cases that represent the expected outcomes before the development of the actual code.

  <img width="600" src="https://storage.googleapis.com/bitloops-github-assets/behavior-driven-development-cycle-what-is-.png"
If you're interested in learning more about BDD, you can find a detailed description [here](https://bitloops.com/docs/bitloops-language/learning/software-design/behavior-driven-development).  

</br>
</br>

---
## Event-Driven Architecture
EDA is a messaging-based architecture that enables components in a software system to communicate through events. This ensures adequate decoupling. 

In EDA, event producers generate events and publish them to event channels, which then deliver them to event consumers. An event consumer subscribes to specific channels to receive a notification every time an event is published to that channel.

Overall, EDA is viewed as an effective way to design and build software systems that are flexible, resilient, scalable and efficient:
- **Scalability:** through decoupling its possible to scale each component independently. Key for distributed systems. 
- **Resilience:** the failure of one component does not impact the entire system. There are always dependencies, but many components can continue running if a single component is unable to process the events it receives.
- **Flexibility:** given this decoupling, each component can be maintained independently as well, making it easier to replace components as the system evolves. 
- **Efficiency:** event driven systems are normally faster at processing requests as they're less resource-intensive than other forms of communication

</br>
</br>
<p align="center" style="margin-bottom: 0px !important;">
  <img width="600" src="https://storage.googleapis.com/bitloops-github-assets/Event-Driven-Architecture-diagram.webp"
" alt="Event Driven Architecture EDA" align="center">
</p>

<p align="center">
Event-Driven Architecture (EDA). Source: <a href="https://www.scylladb.com/glossary/event-driven-architecture/"> SCYLLADB</a>
</p>

</br>
</br>


The core components of Event-driven Architecture (EDA) are:. 

- **Events:** notifications that are generated by event producers and consumed by event consumers. They carry information about an action or state change within the system.

- **Event producers:** components that generate events. Could be due to a user interaction, a database updates or a sensor reading in an IoT device. Event producers publish events to event channels for event consumers to receive.

- **Event consumers:** components that receive and consume events. They subscribe to event channels and are notified when events are published to those channels. Event consumers react to events they receive.

- **Event channels:** medium through which events are delivered from event producers to event consumers. These are message queues that store and deliver events and can be pub/sub channels, point-to-point channels, and hybrid channels.

If you would like to learn more about EDA, we have a more complete overview [here](https://bitloops.com/docs/bitloops-language/learning/software-architecture/event-driven-architecture).


</br>
</br>

---
## Command and Query Responsibility Segregation (CQRS)
CQRS is a software architecture pattern (note: it is not a software architecture style like Hexagonal Architecture) that separates the command and query responsibilities of an application. This pattern has gained popularity as it improves scalability and performance as it provides a way to handle complex data models by separating read and write operations. 

- **Command:** A method that modifies or mutates the state underneath the interface, but does not provide any answer with regards to that state
- **Query:** A method that answers teh current state beneath the interface but does not modify that state before answering it

</br>
</br>
<p align="center" style="margin-bottom: 0px !important;">
  <img width="600" src="https://storage.googleapis.com/bitloops-github-assets/CQRS_Detail.png"
" alt="Command-Query Responsibility Segregation (CQRS)" align="center">
</p>

<p align="center">
Command-Query Responsibility Segregation (CQRS). Source: <a href="https://kalele.io/really-simple-cqrs/"> KALELE</a>
</p>

</br>
</br>

By following this pattern, you're able to optimize the processes for data retrieval, as well as the processes for data processing. This enables much easier horizontal scaling, better performance and improved user experience. 

Maybe most importantly, CQRS improves data consistency by ensuring that write operations are always handled in a consistent and reliable manner. This can lead to fewer errors and a more reliable application overall.



</br>
</br>

---
## Event Sourcing (ES)
ES is nothing more than capturing all the changes to an application as a sequence of events!

Think about that. How cool would it be to be able to regenerate your entire application history? Not only would we be able to understand the state, but also understand how we got there. 

Event Sourcing is basically about capturing every single change to an application's data, and store it as a sequence of events, so we can query these events, use them in an event log to reconstruct past events, and even use them for testing purposes. 

One of the key ES principles is to guarantee that all changes to the domain objects are initiated by  event, given we're storing events (if you make changes to your database without the use of an event, then that change will not be captured by the event log and ES becomes incomplete). 

With this, you're able to do:
- **Complete rebuilds:** Ultimately, you could rebuild your entire application by re-running the events
- **Temporal Query:** It is possible to understand the state at any point in time in history by simply running the event log until the point in time we want to analyze 
- **Event Replay:** It's also possible to correct passed events and compute the state after reversing or correcting a particular event. 
- **Testing:** If you're keen on running a comprehensive test on a major product addition or enhancement, its possible to run all of the events and understand the implications to the application state

Event sourcing most definitely sounds like an interesting pattern to implement, however, there are many aspects to consider. If you're looking for more details, the [Marting Fowler](https://martinfowler.com/eaaDev/EventSourcing.html) has a great essay on the topic. 

</br>
</br>

---
## Eventual Consistency 
Software systems, particularly enterprise applications, are built to have high availability and fault tolerance, as well as great performance and scalability. 

Achieving all of this is very difficult, especially if we want to ensure data consistency, whilst operating these distributed systems which are running across multiple servers. There are network delays, message loss or server failures that need to be taken into considering. 

As the term applies, eventual consistency is a design model used in distributed software that allows for updates to be made to different parts of the system independently, without requiring that all nodes have an immediate, consistent view of the data. Instead, the system will eventually reach a consistent state, after some period of time.

In an eventually consistent system, updates may be applied asynchronously and may propagate to different nodes at different rates. This means that different nodes may have different views of the data at any given point in time. However, over time, as updates propagate to all nodes, the system will converge on a consistent state.

To achieve eventual consistency, systems may use a variety of techniques, such as:
- **Conflict resolution:** resolving conflicts when they arise
- **Versioning:** assigning unique identifies to each update, along the system to track the history of changes
- **Reconciliation:** periodically comparing different views of the data to detect and correct any inconsistencies. 

By using these techniques, eventually consistent systems are able to provide high availability and scalability while still ensuring data consistency over time.

</br>
</br>

---

## Event Storming

[Event storming](https://www.eventstorming.com/) is a collaborating modelling technique used to model complex domains, aligned perfectly with [Domain Driven Design (DDD)](https://bitloops.com/docs/bitloops-language/learning/software-design/domain-driven-design) as well as [Event Driven Architecture (EDA)](https://bitloops.com/docs/bitloops-language/learning/software-architecture/event-driven-architecture). 

The main idea is to gather people from all parts of the business (business - domain experts and engineering) to collaborate in order to be able to align the final software system produced with the actual business processes. This way all stakeholders can communicate effectively utilizing the ubiquitous language, and the software would be a reflection with the actual business processes (see [DDD](https://bitloops.com/docs/bitloops-language/learning/software-design/domain-driven-design)). 

The Event Storming Process, in a nutshell is a process which could be separated in 3 parts:

* **Big Picture Event Storming** (BPES)
* **Process Level Event Storming** (PLES)
* **Design Level Event Storming** (DLES)

### Big Picture Event Storming
This is the first phase of Event Storming for which all the participants are gathered and start to add **orange stickies** initially in a wall (or in a collaborative tool), which **represent the events** that can happen in the system and processes, written in past tense. 

Then the events are grouped together and put in chronologically order.

In this part of the event storming some close related events can be spotted. So basically based on those events we can start modularize the system based on the bounded contexts ([DDD](https://bitloops.com/docs/bitloops-language/learning/software-design/domain-driven-design)) we are discovering in the **BPES**. Moreover via this initial stage we can discover some events which belong to the same process - thus **discovering  the system's processes**. Then the most important parts/processes of the system can be spotted, in order to be prioritized as the most important to be developed.

Except the domain events (orange stickies), in this part of the process dome more stickies could be introduced like: 
* **Hot spots (purple stickies)**: things to be discussed/clarified later
* **Actors (yellow stickies)**: people/systems who are responsible for the production of the domain event.
* **Systems (pink stickies)**: External systems which can create domain events in our system.

### Process Level Event Storming
In this second part of the Event Storming process, after the domain events of the system have been grouped, and most important processes have been spotted, a more thorough modelling will take place, introducing some more concepts (and stickies):

* **Commands (blue stickies)**: Represents decisions, actions or intent.
* **Query Model/Read Model (green stickies)**: The necessary information needed for an actor to make a decision.
* **Policy (Lilac stickies)**: Reactive Logic ("whenever X happens, we do Y" ).

In this part of the event storming process, the business process being modelled will be really close to the software output.

### Design Level Event Storming
This is the final part of the event storming process. 

During the previous parts, some consistent business **rules/constraints** would have arisen during the discussions. These could usually being represented via another flavour of yellow stickies (distinct from the one used for the actors). 

The **Aggregates** (Aggregate Roots) (see [DDD]((https://bitloops.com/docs/bitloops-language/learning/software-design/domain-driven-design))), would be the sum of all closely related business rules (yellow stickies).

After including the constraints(aggregates) the Event Storming Session is finally over, and then the development can start for this specific business process.

### Event Storming Syntax

The general syntax of event storming is the following:

* A **command** can be issued by an **actor** or a **policy**
* An **event** can be triggered by an **external system** or an **aggregate**.
* An **event** can **activate a policy** and/or **update a read model**.
* A **read model** provides information to an **actor**.

<p align="center" style="margin-bottom: 0px !important;">
  <img width="900" src="https://storage.googleapis.com/bitloops-github-assets/Event%20Stroming%20Syntax.png" alt="Event storming syntax" align="center">
</p>

### More on Event Storming

For more on event storming you could check [this repository](https://github.com/ddd-crew/eventstorming-glossary-cheat-sheet) from DDD crew as well as read the original [book](https://leanpub.com/introducing_eventstorming) from Alberto Brandolini.

</br>
</br>

---
## 🚀 Bringing this all together!
To summarize, we have reviewed the following:
- Hexagonal architecture is a software architecture the places the Domain Layer at the center with no dependencies on any other layer. The Application Layer around the Domain Layer orchestrates the services, and combined the form the Application Core. On the outer layer we have the Infrastructure Layer that comprises the User Interface, Database, etc. The key consideration is that we must use Ports and Adapters to connect the Application Core with the Infrastructure Layer - this ensures clear separation of concerns, improving the modularity, testability and maintainability of a software system.

- Domain-driven design is a software design pattern that helps you build well-defined, easy to understand domain models, more specifically the Application Core (Domain and Application Layers of the Hexagonal Architecture). By applying these principles, the domain is more representative of the business itself and the business logic is easier to change. Moreover, it works particularly well with Ports and Adaptors to maintain the separation we desire between Application Core and the Infrastructure Layer.

- Behavior-driven development is a software development approach that allows you to better understand the expected behaviors of the application, the expected outcomes, and ultimately generates a common understanding between all stakeholders. [BDD](https://bitloops.com/docs/bitloops-language/learning/software-design/behavior-driven-development) is particularly important to increase cohesion between modules and components.

- Event-driven architecture is all about setting up your different services and modules in such a way that they produce or consume events. This increases the resilience and flexibility as the components are decoupled from one another, improving scalability and performance. 

- CQRS is all about separating your methods into commands and queries, and never mixing the two. This ensures separation of concerns from a business logic perspective, keeping the code clean, easy to understand and easy to change.

- Event Sourcing is a software design pattern that ensures all changes to objects (database) happens through an event, and that event is stored sequentially in order to have a complete log of all state changes to the application, and be able to rebuild, test or correct states using that log. 

Hopefully its clear that implementing these software architecture and design patterns will undoubtedly produce high-quality software, that is flexible, resilient and easy to maintain. It will be very easy to onboard new developers to the project, create a new feature, or change a particular technology or infrastructure. 

It's probably also overwhelming as its not easy to implement all this as it requires experience and quite a bit of additional overhead. However, the domain framework above has been created to provide you will all the necessary boilerplate, scaffolding, pipeline and even infrastructure code necessary to build an application that follows these design principles. 

Below is a great diagram inspired by [Herberto Graça!](https://herbertograca.com/) that combines Hexagonal, Clean, Onion, DDD, CQRS and many more concepts 

</br>
</br>

<p align="center" style="margin-bottom: 0px !important;">
  <img width="800" src="https://storage.googleapis.com/bitloops-github-assets/Domain-driven%20Design%20and%20Hexagonal%20Architecture%20and%20CQRS%20and%20Event%20Sourcing.png" alt="Explicit Architecture" align="center">
</p>

<p align="center">
DDD + Hexagonal Architecture + CQRS + EDA: <a href="https://github.com/Sairyss/domain-driven-hexagon/blob/master/README.md#pros"> GitHub</a>
</p>

The overarching idea is the following:
- A User makes a request and a Command/Query is sent to the controller using a DTO
- The Controller maps this through an Adapter and then a Port to an Application Service
- The Application Service (within the Application Core) handles the Command/Query
- The Application Service communicates with the Domain Layer (domain services, aggregate, entities) to execute the required business logic
- The Application Core communicates through Ports and Adapters to the Infrastructure Layer
- The Infrastructure Layer maps the relevant data, retrieves/persists data from/to a database
- Through Inversion Control, it passes the data back to the Application Core
- Once the Application Core has complete its job, the data/confirmation is returned to the Controllers (again through Ports and Adapters)
- The Controllers return data back to the User

With this approach, the domain layer cannot be corrupted with other code, there is clear separation of concerns and each component follows a single-responsibility principle. 

This is a general overview and each project needs to be tailored accordingly, with more or less layers/components. Moreover, it is always possible to refactor and improve on these layers at a later stage if required. What is important is to create the foundation for that future refactoring work. 



## 🙌 Contributing

If you'd like to get involved feel free to learn more about the [Bitloops Language](https://github.com/bitloops/bitloops-language) and contribute to this Repo or our main project.  

You can also contribute with a star to spread the word!

<p align="center" style="margin-bottom: 0px !important;">
  <img width="600" src="https://storage.googleapis.com/bitloops-github-assets/star-us.gif"
</p>

</br>
</br>

---

# 👨‍💻 Additional learning resources

## Articles

- [The Clean Architecture](http://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) - Robert C. Martin (Uncle Bog)
- [Better Software Design with Clean Architecture](https://fullstackmark.com/post/11/better-software-design-with-clean-architecture) - FullStackMark
- [Clean Domain-Driven Design](https://medium.com/unil-ci-software-engineering/clean-domain-driven-design-2236f5430a05) - George
- [Bounded Contexts are NOT Microservices](https://vladikk.com/2018/01/21/bounded-contexts-vs-microservices/) - Vladikk
- [Deep Dive into CQRS — A Great Microservices Pattern](https://levelup.gitconnected.com/what-is-cqrs-8ddd74ca05bb) - LevelUp
- [Clean Event-Driven Architecture](https://valerii-udodov.com/posts/event-sourcing/clean-event-driven-architecture/) - Val's Tech Blog
- [Clean Architecture with TypeScript: DDD, ONION](https://bazaglia.com/clean-architecture-with-typescript-ddd-onion/) - bazaglia.com
- [Comparison of Domain-Driven Design and Clean Architecture Concepts](https://khalilstemmler.com/articles/software-design-architecture/domain-driven-design-vs-clean-architecture/) - Khalilstemmler.com
- [Anemic Domain Model](https://khalilstemmler.com/wiki/anemic-domain-model/) - Khalilstemmler.com
- [Events: Fat or Thin](https://codesimple.blog/2019/02/16/events-fat-or-thin/#:~:text=Thin%20Events%20shine%20when%20the,in%2Dtime%20processing%20is%20required) - CODE SIMPLE{}
- [CQRS Software Architecture Pattern: The Good, the Bad, and the Ugly](https://betterprogramming.pub/cqrs-software-architecture-pattern-the-good-the-bad-and-the-ugly-e9d6e7a34daf) - Jawad Margieh
- [Domain Driven Design and Development In Practice](https://www.infoq.com/articles/ddd-in-practice/) - InfoQ
- [Combining Domain Driven Design and Behaviour Driven Development](https://baasie.com/2018/02/14/combining-domain-driven-design-and-behaviour-driven-development/) - baasie.com
- [CQRS](https://martinfowler.com/bliki/CQRS.html) - Marting Fowler
- [Domain events: Design and implementation](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-events-design-implementation#singl[%E2%80%A6]egates) - Microsoft
- [Domain-Driven Design and Domain Specific Languages](https://www.infoq.com/presentations/ddd-dsl-evans/) - InfoQ
- [Domains, Sub-Domains and Bounded Contexts: Explained with example from industry](https://alok-mishra.com/2020/08/17/ddd-domains-bounded-contexts/) - Alok Mishra
- [DDD, Hexagonal, Onion, Clean, CQRS, … How I put it all together](https://herbertograca.com/2017/11/16/explicit-architecture-01-ddd-hexagonal-onion-clean-cqrs-how-i-put-it-all-together/) - herbertograca.com


## Blogs

- [Clean Coder](https://blog.cleancoder.com/) - by Robert C. Martin (Uncle Bob)
- [martinFowler.com](https://martinfowler.com/) - Martin Fowler
- [Khalilstemmler.com](https://khalilstemmler.com/) - by Khalil Stemmler
- [@hgraca](https://herbertograca.com/) - Herberto Graça
- [Alok Mishra](https://alok-mishra.com/) - Alok Mishra
- [Mr. Picky](https://mrpicky.dev/) -
- [Nicolò Pignatelli](https://medium.com/@nicolopigna) - Nicolò Pignatelli
- [bassie.com](https://baasie.com/blog/) - Kenny Baas-Schwegler
- [CODE SIMPLE{}](https://codesimple.blog/) - Satjinder Bath
- [Val's Tech Blog](https://valerii-udodov.com/) - Valerii Udodov
- [Kevin Vogel](https://medium.com/@hellokevinvogel) - Kevin Vogel


## Videos
- [7 Years of DDD: Tackling Complexity in Large-Scale Marketing Systems](https://www.youtube.com/watch?v=DIu1FLD8CsE) - Vladik Khononov, NDC {Sydney} 2018
- [A Decade of DDD, CQRS, Event Sourcing](https://www.youtube.com/watch?v=LDW0QWie21s) - Greg Young, DDD Europe 2016
- [More Testable Code with the Hexagonal Architecture](https://youtu.be/ujb_O6myknY) - Ted Young, Webinar 2019
- [If (domain logic) then CQRS, or Saga?](https://www.youtube.com/watch?v=fWU8ZK0Dmxs) - Udi Dahan, DDD Europe 2017
- [Herberto Graca - Making architecture explicit](https://www.youtube.com/watch?v=_yoZN9Sb3PM&feature=youtu.be) - Herberto Graça, PHP Srbija 2019
- [What is DDD](https://www.youtube.com/watch?v=pMuiVlnGqjk) - Eric Evans, DDD Europe 2019

## Books
- [Domain-Driven Design: Tackling Complexity in the Heart of Software](https://www.oreilly.com/library/view/domain-driven-design-tackling/0321125215/) – Eric Evans
- [Implementing Domain-Driven Design](https://www.amazon.com/Implementing-Domain-Driven-Design-Vaughn-Vernon/dp/0321834577) – Vaughn Vernon
- [Enterprise Integration Patterns: Designing, Building, and Deploying Messaging Solutions](https://www.amazon.com/Enterprise-Integration-Patterns-Designing-Deploying/dp/0321200683) – Gregor Hohpe, Bobby Wolf
- [Clean Architecture: A Craftsman's Guide to Software Structure and Design](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164) - Robert C. Martin (Uncle Bob)
- [A Philosophy of Software Design](https://www.goodreads.com/book/show/39996759-a-philosophy-of-software-design) - John Ousterhout
- [Clean Code: A Handbook of Agile Software Craftsmanship](https://www.goodreads.com/book/show/3735293-clean-code) – Robert C. Martin (Uncle Bob)
- [Patterns, Principles, and Practices of Domain-Driven Design](https://www.amazon.com/Patterns-Principles-Practices-Domain-Driven-Design/dp/1118714709) – Scott Millett, Nick Tune

