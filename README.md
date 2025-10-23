# 🌟 Workdink: A Blog Platform on Solana 🌟

Welcome to **Workdink**! This is a decentralized blog platform built on the Solana blockchain, where your articles are securely stored on Arweave. Our platform leverages the power of Solana for fast and efficient transactions while ensuring permanent data storage with Arweave.

## 🚀 Features

- **Decentralized Blogging**: Post your articles securely on the blockchain.
- **Permanent Storage**: Store your content on Arweave for immutable, long-term storage.
- **Wallet Integration**: Connect your Solana wallet to start blogging.
- **User Initialization**: Initialize user profiles seamlessly.
- **Article Management**: Publish, view, and manage your articles with ease.

## 🛠️ Tech Stack

- **Frontend**: React
- **Blockchain**: Solana
- **Storage**: Arweave
- **Wallet Integration**: Solana Wallet Adapter
- **UI Components**: CSS Modules
- **Notifications**: React Toastify

## 📋 Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Components](#components)
4. [Scripts](#scripts)
5. [Contributing](#contributing)
6. [License](#license)

## 🛠️ Installation

To get started with Workdink, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone [https://github.com/yourusername/workdink](https://github.com/MarianoAkaMery/wordink-DeSci.git)
    cd workdink
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Start the development server**:
    ```bash
    npm start
    ```

4. **Build the project**:
    ```bash
    npm run build
    ```

## 🚀 Usage

### Connect Wallet

1. **Connect your Solana wallet**: When you first visit the platform, you'll need to connect your Solana wallet. If not connected, a modal will prompt you to do so.
2. **Initialize Profile**: If you're a new user, initialize your profile by providing a username and avatar.

### Write and Publish Articles

1. **Create a new post**: Click on the 'Publish' button to start writing your article.
2. **Submit**: After writing, submit your article which will be saved on Arweave and linked through the Solana blockchain.
3. **View Articles**: All published articles can be viewed and managed from your profile.

## 🧩 Components

### Modal Components

1. **InputModal**: Used for inputting article title and subtitle.
2. **SuccessModal**: Displays a success message after an article is published.
3. **WalletModal**: Prompts the user to connect their wallet.

### Editor Component

**Tiptap**: A rich text editor component used for writing and editing articles.

## 🖥️ Scripts

- `npm start`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm test`: Runs tests.
- `npm run eject`: Ejects the app from Create React App setup.

## 👥 Contributing

We welcome contributions to Workdink! To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

Please ensure your pull request adheres to the following guidelines:

- Follow the project's coding conventions.
- Ensure that your code is well-documented.
- Write tests for your changes.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
