# Offtiktok | The Open TikTok Client

Offtiktok allows users to share tiktoks with anyone, regardless of whether they have the app or not, by adding "off" before "tiktok" in their url (e.g: [https://vm.offtiktok.com/ZGe7XpCwV/](https://vm.offtiktok.com/ZGe7XpCwV/) )

It also includes a minimalistic TikTok feed that allows to watch recommended videos by the platform, no ads, no app, no geo-restrictions.

### This repository includes the frontend server. [If you're looking for the backend, it's here](https://github.com/MarsHeer/offtiktokapi)


## Deploy it yourself

### 1. Install Node & npm (or your package manager of preference)
#### macOS

1.  **Using Homebrew**:
    
    -   Install Homebrew if you haven't already:
        `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
    
    -   Install Node.js and npm:
    `brew  install  node`
        
        brew  install  node
        
2.  **Using Node Version Manager (nvm)**:
    
    -   Install  `nvm`:
        
        `curl  -o-  https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash`
        
    -   Load  `nvm`:
        
        ```
        export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s
        "${XDG_CONFIG_HOME}/nvm")"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        ```
	
    -   Install Node.js:
        
		`nvm  install  node`
        

#### Linux

1.  **Using NodeSource Binaries**:
    
    -   Install Node.js and npm:
        
        ```
	    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
		sudo apt-get install -y nodejs
		```
		
        
2.  **Using Node Version Manager (nvm)**:
    
    -   Install  `nvm`:
        
        `curl  -o-  https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash`
        
    -   Load  `nvm`:
        
        ```
        export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s
        "${XDG_CONFIG_HOME}/nvm")"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
		```
        
    -   Install Node.js:
        
		`nvm  install  node`
        

#### Windows

1.  **Using Node.js Installer**:
    
    -   Download the Windows installer from the  Node.js website.
    -   Run the installer and follow the prompts.
    - 
2.  **Using Node Version Manager for Windows (nvm-windows)**:
    
    -   Download and install  `nvm-windows`  from the  nvm-windows releases.
    -   Install Node.js:
        ```
        nvm  install  latest
        nvm  use  latest
        ```

After installation, verify that Node.js and npm are installed correctly by running:

```
node  -v
npm  -v
```

### 2. Install dependencies

To instal project dependencies, run: `npm install`

### 3. Configure your .env
Create a `.env` file and copy the contets of the `.env.template` file included in the repository.

The INTERNAL API URL should just be the frontend's URL

The EXTERNAL API URL should be your backend's URL

### 4. Ready for dev!
Run `npm run dev` to get your development server running in port `2000`


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# Collaborating
Collaborations are welcome!  Please feel free to support the project by creating requests or pull requests

# License
This project is licensed under the MIT License
