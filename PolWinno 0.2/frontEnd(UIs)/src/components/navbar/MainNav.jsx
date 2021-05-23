import React from 'react';
import {NavLink} from 'react-router-dom';



const MainNav = () => {


    return (
      
        <header className="masthead mb-auto">
            <div className="inner">
            <div>
              <NavLink to="/" > <img className="site-logo" src="/assets/images/logo.png" alt="logo"/> </NavLink>
            </div>
              <nav className="nav nav-masthead justify-content-end">
                  <NavLink className="nav-link" exact to="/tables/assignNeedyToPlans">تخصیص نیازمند به طرح </NavLink>
                  <NavLink className="nav-link" exact to="/tables/plans">طرح ها</NavLink>
                  <NavLink className="nav-link" exact to="/tables/personalInfo">اشخاص</NavLink>
                  <NavLink className="nav-link" exact to="/tables/charityAccount">حساب های خیریه</NavLink>
                  <NavLink className="nav-link" exact to="/tables/commonBaseType">فرم شناسه ثابت</NavLink>
              </nav>
            </div>
          </header>

    );
}

export default MainNav;