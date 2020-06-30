import React from 'react';

export default class BaseStatefulScreen extends React.Component {
  route;
  navigation;

  constructor(props) {
    super(props);
    this.route = this.props.route;
    this.navigation = this.props.navigation;
  }

  buildBaseState() {
    return {
      loading: false,
      error: null,
    };
  }

  setError(error: string) {
    this.setState({error: null});
  }

  getError(): string {
    return this.state.error;
  }

  setIsLoading(isLoading: boolean) {
    this.setState({loading: isLoading});
  }

  isLoading(): boolean {
    return this.state.loading;
  }
}
