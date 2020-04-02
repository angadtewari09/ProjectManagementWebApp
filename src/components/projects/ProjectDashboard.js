import React from 'react';
import { Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Tabs,Tab } from 'react-bootstrap';
import MessageBoard from './MessageBoard';
import UsersList from './UsersList';
import AssignTask from './AssignTask';
import { getCurrentProject } from '../../store/actions/projectActions';

class ProjectDashboard extends React.Component{
    
    componentDidMount(){
        const currID=(this.props.match.params.id);
        this.props.getCurrentPoject(currID);
    }

    render(){
        //destructure props

        const {projects,auth,users,messages}=this.props;
        console.log(this.props);

        //Get Current Project
        const currentProject=projects && projects.filter(project=>
           (project.id===this.props.match.params.id)
        )
        
        return(  
            <Container fluid>
            {(auth && auth.uid)?(
                (currentProject && currentProject[0].createdBy===auth.uid)?
                (
                    <div style={{alignContent:"center",textAlign:"center"}}>
                    <h1>Authorized To Access The Project.</h1>
                    <h2>Project Dashboard</h2>
                    <Tabs defaultActiveKey="you" id="uncontrolled-tab-example">
                    <Tab eventKey="home" title="Home">
                      <h1>Important Details</h1>
                      <h2>{currentProject[0].title}</h2>
                    </Tab>
                    <Tab eventKey="announcements" title="Announcements">
                        <MessageBoard id={currentProject[0].id}/>       
                    </Tab>
                    <Tab eventKey="assignTask" title="Assign Tasks">
                        <h1>Assign Task Here</h1>
                        <AssignTask users={currentProject[0].members} id={currentProject[0].id}/>

                    </Tab>
                    <Tab eventKey="addUsers" title="Add User">
                       <UsersList/>
                    </Tab>
                    </Tabs>
                    </div>
                )
                :
                (
                    <h3>Not Authorized To Access.</h3>
                )
            ):(
                <h1>Not Authenticated Yet!</h1>
            )}          
            </Container>
            
        )
    }
}

const mapStateToProps=(state)=>{
    return{
        projects: state.firestore.ordered.projects,
        auth: state.firebase.auth,
        users: state.firestore.ordered.appUsers,
        currentProject: state.projects
    }
}

const mapDispatchToProps=(dispatch)=>{
    return{
        getCurrentPoject: (id)=>dispatch(getCurrentProject(id))
    }
}

export default compose(connect(mapStateToProps,mapDispatchToProps),firestoreConnect((ownProps)=>{
    return [
        {
        collection: 'projects',
    },{
        collection: 'appUsers'
    }
    ]  
}))(ProjectDashboard);