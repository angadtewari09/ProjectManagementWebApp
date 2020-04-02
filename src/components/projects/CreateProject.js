import React from 'react';
import { Form,Button } from 'react-bootstrap';
import { firestoreConnect } from 'react-redux-firebase';
import { compose} from 'redux';
import { connect } from 'react-redux';
import { createProject } from '../../store/actions/projectActions';

class CreateProject extends React.Component{
    state={
        title:'',
        members:[]
    }

    newMembers=[]

    handleChange=(e)=>{
        this.setState({
            [e.target.id]:e.target.value
        })
    }

    handleChecks=(e)=>{
        if(e.target.checked){
                 this.newMembers.push(e.target.value)
                 this.setState({
                     members: this.newMembers
                 }) 
             }
    }

    handleSubmit=(e)=>{
        e.preventDefault();
        console.log(this.state);
        this.props.createProject(this.state);
    }

    render(){
        const { auth,users }=this.props;

        //console.log(this.props)
        return(
            <div className="center">
               {(auth.uid)?(
                   <div style={{textAlign:"center"}}>
                    <h1>Signed in As: {auth.displayName}</h1>
                    <Form>
                        <Form.Group controlId="title" onChange={this.handleChange}>
                            <Form.Label>Project Title</Form.Label>
                            <Form.Control type="title" placeholder="Project Title" />
                        </Form.Group>
                        <h1>Select Members To Add As Users.</h1>
                        {users && users.map(user=>{
                            return(
                            <div key={user.id}>
                            <input type="checkbox" name="Users" value={user.userId} onChange={this.handleChecks}/>
                            <h5>{user.userId}</h5>
                            </div>
                            )
                        })}
                        <Button variant="primary" type="submit" onClick={this.handleSubmit}>
                            Submit
                        </Button>
                    </Form>
                    </div>
               ) :(
                   <div>
                   <h1>Not Signed In.</h1>
                   <a href="/">Sign In Here</a>
                   </div>
               )}
            </div>
           
        )
    }
}

const mapStateToProps=(state)=>{
    return {
        auth: state.firebase.auth,
        users: state.firestore.ordered.appUsers
    }
}

const mapDispatchToProps=(dispatch)=>{
    return  {
        createProject: (project)=>dispatch(createProject(project))
    }
}

export default compose(connect(mapStateToProps,mapDispatchToProps),firestoreConnect([{
    collection: 'appUsers'
}]))(CreateProject);