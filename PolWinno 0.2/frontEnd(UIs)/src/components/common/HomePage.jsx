import React from 'react';
import HomeHeader from './HomeHeader';
import HomeNav from '../navbar/HomeNav';


const HomePage = () => {


    return (

        <div className="io-zinnia" data-spy="scroll" data-target="#mainnav" data-offset="80">

            <header className="site-header is-sticky">


                <HomeNav />


                <HomeHeader />
                


            </header>

        </div>

    );
}

export default HomePage;