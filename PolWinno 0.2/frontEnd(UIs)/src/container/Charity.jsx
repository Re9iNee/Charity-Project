import React from 'react';
import { Route, Switch } from 'react-router';
import HomePage from '../components/common/HomePage';
import MainLayout from '../components/layout/MainLayout';
import CommonBaseType from '../components/tables/baseTypes/CommonBaseType';
import CharityAccount from '../components/tables/charityAccount/CharityAccount';
import Plans from '../components/tables/plans/Plans';
import PersonalInfo from '../components/tables/personalInfo/personalInfo';



const Charity = () => {
    return ( 
        <Switch>


            <Route path={["/tables"]}>
                <MainLayout>
                    <Switch>
                        <Route path="/tables/personalInfo" component={PersonalInfo} />
                        <Route path="/tables/plans" component={Plans} />
                        <Route path="/tables/charityAccount" component={CharityAccount} />
                        <Route path="/tables/commonBaseType" component={CommonBaseType} />
                    </Switch>
                </MainLayout>
            </Route>

            <Route path="/" component={HomePage}/>
            
        </Switch>
     );
}
 

export default Charity;