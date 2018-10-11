import { auth, database } from 'firebase';
import { Actions } from 'react-native-router-flux';

import types from '../types';

export const emailChanged = text => ({
	type: types.EMAIL_CHANGED,
	payload: text,
});

export const passChanged = text => ({
	type: types.PASS_CHANGED,
	payload: text,
});

requestAuthSuccess = user => {
	Actions.main();

	return {
		type: types.AUTH_SUCCESS,
		payload: user,
	};
};

requestAuthFailure = err => ({
	type: types.AUTH_ERROR,
	payload: err,
});

export const requestAuth = (email, password) => dispatch => {
	dispatch({ type: types.REQ_AUTH });
	return auth()
		.signInWithEmailAndPassword(email, password)
		.then(user => dispatch(requestAuthSuccess(user)))
		.catch(() =>
			auth()
				.createUserWithEmailAndPassword(email, password)
				.then(user => dispatch(requestAuthSuccess(user)))
				.catch(err => dispatch(requestAuthFailure(err)))
		);
};

export const setUser = user => ({
	type: types.SET_USER,
	user,
});

export const logoutUser = () => auth().signOut();

export const createEmployee = ({ name, phone, shift }) => {
	const { currentUser } = auth();
	console.log(currentUser);
	database()
		.ref(`/users/${currentUser.uid}/employees`)
		.push({ name, phone, shift });

	return {
		type: types.CREATE_EMPLOYEE,
	};
};

export const fetchEmployees = () => dispatch => {
	const { currentUser } = auth();
	dispatch({ type: types.FETCH_EMPLOYEES });

	return database()
		.ref(`/users/${currentUser.uid}/employees`)
		.on('value', snapshot =>
			dispatch({
				type: types.FETCH_EMPLOYEES_SUCCESS,
				payload: snapshot.val(),
			})
		);
};
