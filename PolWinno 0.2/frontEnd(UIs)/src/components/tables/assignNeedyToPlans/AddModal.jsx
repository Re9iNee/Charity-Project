import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import ComboBox from 'react-responsive-combo-box';
import _ from 'lodash';
import { createAssignNeedyToPlans } from '../../../action/assNeedyToPlans';




const AddModal = ({showMoldal , closeMoldal , needies , plans}) => {

    const [needyName , setNeedyName] = useState("");
    const [planName , setPlanName] = useState("");
    const [Fdate , setFdate] = useState("");
    const [Tdate , setTdate] = useState("");



    let needyData = needies.map( (needy) =>  needy.Name + " " + needy.Family );
    const planData = plans.map( (plan) => plan.PlanName );


    const dispatch = useDispatch();

    
    const resetState = () => {
        setNeedyName('');
        setPlanName('');
        setFdate('');
        setTdate('');
    };



    const handleSubmit = async (event) => {
        event.preventDefault();

        let NeedyId = _.filter(needies , (needy) => needy.Name + " " + needy.Family === needyName)
        NeedyId = NeedyId[0].PersonId

        let PlanId = _.filter(plans , (plan) => plan.PlanName === planName)
        PlanId = PlanId[0].PlanId


        const assNeedyToPlan = {NeedyId , PlanId , Fdate , Tdate};

        try {

            dispatch(createAssignNeedyToPlans(assNeedyToPlan));
            
            resetState();

        } catch (err) {
            toast.error("رکورد جدید ساخته نشد", {
                position: "bottom-right",
                closeOnClick: true
            });
            console.log(err);
        }
    };


    return ( 


        <Modal isOpen={showMoldal} onRequestClose={closeMoldal} appElement={document.getElementById('root')} 
        style={{
            overlay: {
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.75)',
                zIndex: 1000
            },
            content: {
                position: 'absolute',
                top: '50px',
                left: '150px',
                right: '150px',
                bottom: '50px',
                border: '1px solid #ccc',
                background: '#fff',
                overflow: 'auto',
                WebkitOverflowScrolling: 'touch',
                borderRadius: '5px',
                outline: 'none',
                padding: '20px'
            }
        }}>
            <div className="tableModal">
                <form onSubmit={handleSubmit} id="Form" >
                    <div className="row" style={{margin:"50px 0"}} >
                        <div className="col-md-12 ">
                            <ComboBox style={{width:"100%",height:"60px",fontSize:"18px"}} className="text-center" required placeholder='نام و نام خانوادگی نیازمند' options={needyData} enableAutocomplete value={needyName}
                               onSelect ={ (option) => setNeedyName(option) }
                            />
                        </div>
                    </div>
                    <div className="row" style={{margin:"50px 0"}}>
                        <div className="col-md-12">
                            <ComboBox style={{width:"100%",height:"60px",fontSize:"18px"}} className="text-center" required placeholder='نام طرح' options={planData} enableAutocomplete value={planName}
                               onSelect ={ (option) => setPlanName(option) }
                            />
                        </div>
                    </div>
                    <div className="row" style={{margin:"50px 0"}}>
                        <div className="col-md-6">
                            <input type="text" className="form-control text-center" placeholder="تاریخ پایان " required value={Tdate}
                                onChange={e => setTdate(e.target.value) } />
                        </div>
                        <div className="col-md-6">
                            <input type="text" className="form-control text-center" placeholder=" تاریخ شروع " required value={Fdate}
                                onChange={e => setFdate(e.target.value) } />
                        </div>
                    </div>
                    
                    <div className="row" style={{margin:"20px 0"}}>
                        <div className="col-md-6">
                            <button className="btn" type="submit" form="Form" value="Submit">ثبت</button>
                        </div>
                        <div className="col-md-6">
                            <button className="btn" onClick={closeMoldal} >خروج</button>
                        </div>
                    </div>
                </form>
            </div>

        </Modal>
    );
}
 
export default AddModal;

