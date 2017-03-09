import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import App from '../js/components/app/app';

describe('App component', function () {  
    it('should display the app', function () { 
        
        const renderer = TestUtils.createRenderer();
        renderer.render(<App />);
        const result = renderer.getRenderOutput();
        expect(result).toBeTruthy;
    });
});