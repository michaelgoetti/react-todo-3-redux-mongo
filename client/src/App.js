import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import ListItem from './ListItem';
import EditItem from './EditItem';
import { addItem, getAllItems } from './actions';
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);
		
		
		this.state = {
			editMode: false,
			tempItemTitle: '',
		}
		
		this.url='http://localhost:3001/api/list';

		this.addToList = this.addToList.bind(this);
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.search = this.search.bind(this);
		this.toggleEditMode = this.toggleEditMode.bind(this);
		this.enterPressed = this.enterPressed.bind(this);

	}

	search() {
		// fetch(this.url)
		// 	.then(res => res.json()
		// 	.then(json => this.props.getAllItems(json)))
		this.props.getAllItems();
	}

	toggleEditMode(id) {
		console.log("squee");
		this.setState({ editMode: !this.state.editMode });
	}
  

	addToList() {
		let currItem = {
			title: this.state.tempItemTitle,
			description: '',
			cplt: false,
		};
		this.setState({ tempItemTitle: '' });
		this.props.addItem(currItem);
	}

	handleTitleChange(event) {
    this.setState({tempItemTitle: event.target.value});
	}

	enterPressed(event) {
    var code = event.keyCode || event.which;
    if(code === 13 && this.state.tempItemTitle !== '') { 
			this.addToList();
    } 
	}
	
	componentDidMount() {
		this.props.getAllItems();
		document.addEventListener("keydown", this.enterPressed);
		// document.getElementById("main-input").focus();
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this.enterPressed);
	}

  render() {
		const { listReducer } = this.props;
		let mainStyle = {
			width: '95%', 
			display: 'inline-block',
		};
    return (
			<div className="global-wrap">
				{ this.state.editMode ? <EditItem /> : 
					<div>
					<div 
						className="main-entry" 
						style={{mainStyle}}
					>
						<span>with Redux, Node/Express API, and MongoDB</span>
						<h2>TO-DO:</h2>
						<input 
							type="text" 
							className="form-control main-input" 
							id="main-input"
							value={ this.state.tempItemTitle } 
							onChange={ this.handleTitleChange } 
						/>
						<button 
							className="btn btn-info add-btn" 
							disabled={ this.state.tempItemTitle.length === 0 } 
							onClick={ this.addToList } 
						>
							Add to List
						</button>
						<br /> { this.state.editMode ? "edit true" : "edit false" }
					</div>

					<br />
					{ listReducer.length === 0 ? null :
						listReducer.data.length === 0 ? null :
						<div className="task-array">
							<h4>Items:</h4>
							{
								listReducer.data.map((item, index) => {
									return (
										<ListItem 
											key={ `item-${index}` }
											payload={ item }
											index={ index } 
											funcSearch={ this.search }
											funcEdit={ this.toggleEditMode }
										/>
									)
								})
							}
						</div>
					}
					</div>
				}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(
  mapStateToProps,
  {
		addItem,
		getAllItems,
  }
 )(App);
