import React from 'react';
// import StarRatingComponent from 'react-star-rating-component';
// import BadgeSet from '../containers/BadgeSet';
import QuestionSet from './QuestionSet'

import { Link } from 'react-router-dom';

import Strings from '../json/strings.json';

class Profile extends React.Component {
    componentDidMount() {
        this.props.loadQuestions()
    }
    render() {
        const { questions } = this.props;
        return <div id="Profile">
        	{Strings.Profile.body}
            <QuestionSet questions={questions}/>
        </div>
    }
}

export default Profile;