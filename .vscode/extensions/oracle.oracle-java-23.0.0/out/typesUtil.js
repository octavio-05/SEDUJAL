"use strict";
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertNever = exports.isError = exports.isRecord = exports.isObject = exports.isString = exports.asClass = exports.isClassTest = exports.isClass = void 0;
function assertType(obj, isTypeTest, errorMessage) {
    if (!isTypeTest(obj))
        throw new Error(errorMessage || "Object isn't of expected type.");
}
function isClass(cls, obj) {
    return obj instanceof cls;
}
exports.isClass = isClass;
function isClassTest(cls) {
    return (obj) => isClass(cls, obj);
}
exports.isClassTest = isClassTest;
function asClass(cls, obj, errorMessage) {
    assertType(obj, isClassTest(cls), errorMessage);
    return obj;
}
exports.asClass = asClass;
function isString(obj) {
    return typeof obj === 'string';
}
exports.isString = isString;
function isObject(obj) {
    return typeof obj === 'object' && obj !== null;
}
exports.isObject = isObject;
function isRecord(typeTest, obj) {
    return isObject(obj) && Object.values(obj).every(typeTest);
}
exports.isRecord = isRecord;
function isError(obj) {
    return obj instanceof Error;
}
exports.isError = isError;
function assertNever(_obj, errorMessage) {
    throw new Error(errorMessage || "Shouldn't reach here.");
}
exports.assertNever = assertNever;
//# sourceMappingURL=typesUtil.js.map