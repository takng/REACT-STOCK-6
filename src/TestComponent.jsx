import React, {Component} from 'react';

class TestComponent extends Component {
  constructor(props) {
    super (props);
    this.state = {
    };
 }

componentDidMount () {
  fetch('https://newsapi.org/v1/articles?source=bbc-news&sortBy=top&apiKey=1a3af869aa784532972c9711041e4037')
  .then(results => {
    return results.json();
  }).then(data => {
    let articles = data.articles
    console.log(articles)
      articles.map((article) => {
      return (
        <div key={article.results}>
        </div>
        )
    })
    this.setState({articles: articles});
    console.log("state", this.state.articles);
  })
}

  render(){
    if(!this.state.articles) return <p> Loading....</p>
      return (
        this.state.articles.results
  )}
}

export default TestComponent;