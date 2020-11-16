import * as assert from 'assert';

interface ExpectedCall<OriginalFunctionType extends (...params: any) => any> {
    args: Parameters<OriginalFunctionType>;
    returnValue: ReturnType<OriginalFunctionType>;
};

export class Mock<OriginalFunctionType extends (...params: any) => any> {
    private upcomingCalls: Array<ExpectedCall<OriginalFunctionType>>;
    private callNumber: number;
    private original: OriginalFunctionType;
    constructor(mockedFunction: OriginalFunctionType) {
        this.upcomingCalls = [];
        this.callNumber = 0;
        this.original = mockedFunction;
    }

    expect(args: Parameters<OriginalFunctionType>, returnValue: ReturnType<OriginalFunctionType>) {
        this.upcomingCalls.push({ args, returnValue });
        return this;
    }

    run(...args: any) {
        this.callNumber += 1;
        const expectation = this.upcomingCalls.shift();
        assert.ok(expectation, `Too many calls to mocked function: expected no call, got: ` + JSON.stringify(args));
        assert.deepStrictEqual(args, expectation.args, 'Argument mismatch in mock between expected call and actual call');
        return expectation.returnValue;
    }

    verify() {
        assert.deepStrictEqual(this.upcomingCalls.length, 0, 'Some expected calls to the mock were not made');
    }
    
    getOriginal() {
        return this.original;
    }
};

export function mockObject(original: { [key: string]: any }) {
    const mockedMethods = new Map<string,Mock<any>>();
    return {
        method: function<OriginalMethodType extends (...params: any) => any>(methodName: string, methodReference: OriginalMethodType) {
            if (mockedMethods.has(methodName)) {
                return mockedMethods.get(methodName)!;
            }
            const mock = new Mock(methodReference)
            original[methodName] = function(...args: Parameters<OriginalMethodType>) {
                return mock.run.apply(mock, args);
            };
            mockedMethods.set(methodName, mock)
            return mock;
        },
        verify: function() {
            for (let [ methodName, mock ] of mockedMethods.entries()) {
                mock.verify();
                original[methodName] = mock.getOriginal();
            }
            mockedMethods.clear();
        }
    };
};
