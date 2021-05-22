import React from 'react';
import {NavLink} from 'react-router-dom';

const HomeNav = () => {


    return (
        <nav className="navbar navbar-full navbar-expand-lg is-transparent" id="mainnav">
            <NavLink className="navbar-brand " to="/">
                <img className="logo logo-dark" alt="logo" src="assets/images/logo.png" />
                <img className="logo logo-light" alt="logo" src="assets/images/logo.png" />
            </NavLink>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggle">
                <span className="navbar-toggler-icon"><span className="ti ti-align-justify"></span></span>
            </button>
            <div className="collapse navbar-collapse justify-content-between landnav" id="navbarToggle">
                <ul className="navbar-btns" >

                    <li className="nav-item">
                        <NavLink className="nav-link btn btn-sm btn-outline menu-link" id="signin" to="/tables/commonBaseType" >ورود به سرویس ها</NavLink>
                    </li>

                </ul>
            </div>
        </nav>
    );
}

export default HomeNav;