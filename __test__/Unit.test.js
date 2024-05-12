// Unit.test.js
/*
import {
    sum
} from '../code-to-unit-test/unitTest';
*/
const sum = require('../code-to-unit-test/unitTest');
//Testing to see if the file works
test('Sum of 1 + 2', () => {
    expect(sum(1, 2)).toBe(3);
});

//Testing if you are able to add in a Note
test('Adding a note', () => {
    //test to check if we properly added a note
});

test('Deleting a note', () =>{
    //test to check deletion
});

test('Creating a tag' , () =>{
    //test to check creation of tags

});

test('Deleting tags', () => {
    //test to see the deletion of tags
});

test('Set amount of Pre-tags', () =>{
    //check the pre-tags assigned 

});
