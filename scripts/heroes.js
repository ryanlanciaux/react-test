/** @jsx React.DOM */


if(typeof key == typeof undefined){
	alert("Please insert your marvel api key.");
}

function makeApiCall(urlPart){
	urlPart = urlPart||"";
	var url = "http://gateway.marvel.com/v1/public/" + urlPart + (urlPart.indexOf("?") >= 0 ? "&" : "?") + "apikey="+key;
	return $.get(url);
}

function getCharacters(urlPart){
	urlPart = urlPart||"";
	return makeApiCall("characters"+urlPart);
}

var HeroBox = React.createClass({
	loadHeroes: function(){
		getCharacters().then(function(data){
			this.setState({data:data.data.results});
		}.bind(this));
	},
	loadHeroByName: function(name){
		getCharacters("?nameStartsWith=" + name).then(function(data){
			this.setState({data: data.data.results, currentTeam: this.state.currentTeam});
		}.bind(this));
	},
	addToTeam: function(item){
		this.state.currentTeam.push(item);
		this.setState({data:this.state.data, currentTeam: this.state.currentTeam});
	},
	getInitialState: function(){
		return{ data: [], currentTeam: []};
	},
	delete: function(item){
		this.state.currentTeam.splice(item, 1);
		this.setState({data: this.state.data, currentTeam: this.state.currentTeam})
	},
	componentWillMount: function(){
		this.loadHeroes();
		//this.loadHeroByName("Ajaxis");
	},
	render: function(){
		return(
			<div className="heroBox row">
				<div className="col-md-8">
					<HeroForm onSearchSubmit={this.loadHeroByName} onCancel={this.loadHeroes}/> 
					<HeroList data={this.state.data} addToTeam={this.addToTeam} /> 
				</div>
				<div className="col-md-4 teamWrapper">				
					<CurrentTeam data={this.state.currentTeam} delete={this.delete} />
				</div>
			</div>
		)
	}
});

var HeroList = React.createClass({
	addToTeam: function(item){
		//basically a passthru
		this.props.addToTeam(item);
	},
	render: function(){
		var that = this; 
		var nodes = this.props.data.map(function(hero, index){
			return <Hero key={index} name={hero.name} thumbnail={hero.thumbnail} description={hero.description} addToTeam={that.addToTeam}></Hero>;
		});

		return <div className="heroList">{nodes}</div>
	}
});

var Hero = React.createClass({
	getImage: function(){
		return this.props.thumbnail.path + "." + this.props.thumbnail.extension;
	},
	handleClick: function(){
		var image = this.getImage();
		this.props.addToTeam({name: this.props.name, image: image })
	},
	render: function(){
		return (
			<div className="hero col-md-3">
				<div className="heroWrapper">
					<h2 className="heroName">{this.props.name}</h2>
					<div className="imageWrapper">
						<img src={this.getImage()} className="heroThumbnail" />
					</div>
					<div className="description">
						<p>{this.props.description}</p>
					</div>
					<button type="button" className="addToTeam btn btn-primary" onClick={this.handleClick}>Add To Team</button>
				</div>
			</div>
		);
	}
});

var HeroForm = React.createClass({
	handleSubmit: function(){
		var name = this.refs.name.getDOMNode().value.trim();
		this.props.onSearchSubmit(name);
		this.refs.name.getDOMNode().value = '';
		return false;
	},
	handleCancel: function(){
		this.props.onCancel();
	},
	render: function(){
		return (
			<form className="searchForm row form-inline" onSubmit={this.handleSubmit}>
				<div className="col-md-6">
					<input type="text" className="form-control" placeholder="Enter a Hero name" ref="name" />
					<input type="submit" value="Search" className="btn btn-primary" /><br />
				</div>
				<div className="col-md-6 right">
					<button type="button" className="btn" onClick={this.handleCancel}>Clear Results</button>
				</div>
			</form>
		);
	}
});

var CurrentTeam = React.createClass({
	delete: function(item){
		this.props.delete(item);
	},
	render: function(){
		that = this; 
		var nodes = this.props.data.map(function(hero, index){
			return <CurrentTeamItem key={index} name={hero.name} image={hero.image} delete={that.delete}/>
		});

		return <div className="currentTeam"><h2>My Team</h2>{nodes}</div>
	}
});

var CurrentTeamItem = React.createClass({
	delete: function(){
		id = this.props.key; 
		this.props.delete(id); 
	},
	render: function(){
		return (
			<div className="currentTeamItem">
				<img src={this.props.image} />
				<span className="teamMemberName">{this.props.name}</span>
				<button className="delete btn btn-danger" onClick={this.delete}><span className="glyphicon glyphicon-trash"></span></button>
			</div>	
		)
	}
});



React.renderComponent(
	<HeroBox />, document.getElementById('content')
);
