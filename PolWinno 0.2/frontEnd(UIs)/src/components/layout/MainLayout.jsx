import React from "react";
import MainNav from "../navbar/MainNav";

const MainLayout = ({ children }) => {



    return (
        <div className="tableWrapper">
            
            <nav className="navbar navbar-inverse navbar-fixed-top" >


                <MainNav />

            </nav>
            

            <div className="container" id="page-tableWrapper"> 
                {children}
            </div>


        </div>
    );
};

export default MainLayout;
