import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import {Image } from 'react-bootstrap';
import { Tabs,Tab } from 'react-bootstrap';
import { createUser } from '../../store/actions/userActions';

class ProjectList extends React.Component{
    componentDidUpdate(){     
        const {auth,users}=this.props;   
        if(auth && users){
            if(!users.some(user=>user.userId===auth.uid)){
                this.props.createUser({
                    userId: auth.uid,
                    displayName: auth.displayName,
                    photoURL: auth.photoURL
                })
            }
        }
    }
    render(){
        const {projects,auth,users}=this.props;
        console.log(users);

        return(
            <div className="center">
                {(auth.uid && users)?
                (
                    <div className="center">
                     <Image src={auth.photoURL} roundedCircle/> 
                     <h1>Welcome {auth.displayName}</h1>
                     <Tabs id="Home">
                         <Tab eventKey="projectsCreated" title="Projects You've Started">
                         <h1>List Of Projects You Started</h1>
                        {projects && projects.map(project=>{
                            return (project.createdBy===auth.uid)
                            ?
                            (
                            <Link to={'/projects/'+project.id} key={project.id}>
                            <h1 >{project.title}</h1>
                            </Link>
                            )
                            :
                            (null)
                        })}
                         </Tab>
                         <Tab eventKey="createProject" title="Create Project">
                         <Link to="/createProject">
                        <h3>Create A New Project</h3>
                        </Link>
                         </Tab>
                         <Tab eventKey="projectMember" title="Projects You're Part Of">
                         <h1>Projects You Are a Part Of</h1>
                          {projects && projects.map(project=>{
                              return (project.members.some(member=>member.userId===auth.uid))?(
                                  <Link to={'/projects/'+project.id}>
                                      <h1>{project.title}</h1>
                                  </Link>
                              ):(
                                  null
                              )
                          })}
                         </Tab>
                     </Tabs>
                     </div>
                ):
                (
                <div>
                <h1>Not Signed In!</h1>
                <a href="/">Sign In Here.</a>
                </div>
                )}
                
            </div>
        )
    }
}


const mapStateToProps=(state)=>{
    return{
        projects: state.firestore.ordered.projects,
        auth: state.firebase.auth,
        users: state.firestore.ordered.users
        
    }
}

const mapDispatchToProps=(dispatch)=>{
    return{
        createUser: (user)=>dispatch(createUser(user))
    }
}

export default compose(connect(mapStateToProps,mapDispatchToProps),firestoreConnect(()=>[{
    collection: 'projects'
},
{
    collection:'users'
},
]))(ProjectList);