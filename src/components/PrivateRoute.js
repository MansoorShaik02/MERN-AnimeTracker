import { Route, Redirect } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthProvider';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <Route
            {...rest}
            render={(props) =>
                isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
            }
        />
    );
};

export default PrivateRoute;
