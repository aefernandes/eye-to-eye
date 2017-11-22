import * as types from './types';

const initialState = {
    rating: null,
    selectedBadges: []
}

const reducer = (state = initialState, action) => {
    const { type, data } = action;
    switch (type) {
        case types.SUBMIT_FEEDBACK: {
            const { rating } = data;
            console.log("Hit reducer");
            console.log(rating);
            return {
                ...state,
                rating: rating
            }
        }
        case types.TOGGLE_BADGE: {
            const { badgeId } = data;
            let { selectedBadges } = [state.selectedBadges];
            var location = selectedBadges.indexOf(badgeId);
            if (location == -1) {
                selectedBadges.push(badgeId);
            }
            else {
                selectedBadges.splice(location, 1);
            }
            console.log("Hit reducer");
            console.log(selectedBadges);
            return {
                ...state,
                selectedBadges: selectedBadges
            }
        }
        default: {
            return state;
        }
    }
}

export default reducer;