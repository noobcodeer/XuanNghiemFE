import React from 'react';

const specialCharacters = (value) => {
    let regex = /^[a-zA-Z0-9]+$/;
    if (!value.match(regex)) {
        // We can return string or jsx as the 'error' prop for the validated Component
        return <span className="text-danger">{value} có chứa ký tự đặc biệt!</span>
    }
};

export default specialCharacters;