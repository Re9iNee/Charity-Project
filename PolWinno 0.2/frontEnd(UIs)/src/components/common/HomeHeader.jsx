import React from 'react';
import Particles from 'react-particles-js';


const HomeHeader = () => {
    return (

            <div id="header" className="banner banner-zinnia">

                <div className="ui-shape ui-shape-light ui-shape-header">

                    <Particles
                        params={{
                            "particles": {
                                "number": {
                                    "value": 70
                                },
                            },
                            "interactivity": {
                                "events": {
                                    "onhover": {
                                        "enable": true,
                                        "mode": "repulse"
                                    }
                                }
                            },
                            "color" : {
                                "value" : "#ffdd67"
                            }
                        }} 
                    />
                </div>

                <div className="container">
                    <div className="banner-content">
                        <div className="row align-items-center text-center justify-content-center">
                            <div className="col-sm-10 col-md-12 col-lg-10">
                                <div className="header-txt tab-center mobile-center">
                                    <h1> پروژه خیریه ی دوره سبکاد4
                                    <br className="d-none d-sm-block" /> 
                                         NODE-B گروه  
                                    </h1>
                                    <h3> 
                                       رضا عطارزاده - اردشیر امام بخش
                                    </h3>
                                    <div className="gaps size-1x d-none d-md-block"></div>
                                    <div className="gaps size-1x d-none d-md-block"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default HomeHeader;