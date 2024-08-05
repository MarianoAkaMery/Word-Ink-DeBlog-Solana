import Link from "next/link"

const NotFound = () => {
    return ( 
      <div className="notfound">
        <h2>Oops! Page Not Found :/</h2>
        <p>Looks like you've wandered off the beaten path.</p>
        <p>But don't worry, we've left breadcrumbs for you!</p>
        <Link href="/">Take Me Back Home</Link>
      
      </div>
    );
  };
  
  export default NotFound;