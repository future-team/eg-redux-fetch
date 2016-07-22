/**
 * Created by mac on 15/11/24.
 */
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware,compose } from 'redux';
import thunk from 'redux-thunk';

import { loadingMiddleware as fetchMiddleware } from './fetch';
import {fetching} from './fetching';
import LoadingBar from './LoadingBar';
import {isMock} from './mock.js';

export default class BindReact extends Component {
    render() {
        let {reducers,middleware} = this.props;


        if(typeof(middleware) =='undefined'){

            middleware = [];
        }

        console.dir(process);
        // 并返回一个包含兼容 API 的函数。
        let middlewareList = [
            thunk,
            fetchMiddleware,
            ...middleware
        ];

        let createStoreWithMiddleware=null;
        let dev = '';
        if(!isMock() ){

            createStoreWithMiddleware = (
                //你要使用的中间件，放在前面
                applyMiddleware(...middlewareList)
            );

        }else{/*
            let createStoreWithMiddleware = compose(
                applyMiddleware(...middlewareList),
                //必须的！启用带有monitors（监视显示）的DevTools
                DevTools.instrument()
                )(createStore);*/
            dev = require('./DevTools');
            if(dev){
                createStoreWithMiddleware = compose(
                    //你要使用的中间件，放在前面
                    applyMiddleware(...middlewareList),
                    //必须的！启用带有monitors（监视显示）的DevTools
                    dev.instrument()
                );
            }

        }


        // 像使用 createStore() 一样使用它。
        let app = combineReducers({...reducers,fetching});
        let store = createStoreWithMiddleware(createStore)(app);

        window.dispatch=this.dispatch = store.dispatch;
        return (
            <Provider store={store}>
                {this.show(this.dispatch,dev )}
            </Provider>
        );
    }

    show(dispatch,Dev){
        const { Module} = this.props;
        return (
            <div>
                <Module dispatch={dispatch} />
                {Dev ? <Dev /> :''}
                <LoadingBar />
            </div>
        );
    }
}