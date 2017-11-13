import React from 'react';

import strings from '../json/strings.json';

class Badge extends React.Component {
    render() {
        var badgeId = this.props.badgeId;     
        return <div id="Badge">
            <img src={require("../assets/badge-" + badgeId + "-off.png")} width="100" height="100"/>
        </div>
    }
}

export default Badge;