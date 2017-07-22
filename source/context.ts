/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/rxjs-marbles
 */

import { Observable } from "rxjs/Observable";
import { ColdObservable } from "rxjs/testing/ColdObservable";
import { HotObservable } from "rxjs/testing/HotObservable";
import { TestScheduler } from "rxjs/testing/TestScheduler";
import { argsSymbol } from "./args";
import { assertArgs, assertSubscriptions } from "./assert";
import { configure } from "./configuration";
import { Expect } from "./expect";

export class Context {

    public configure = configure;

    constructor(public testScheduler: TestScheduler) {}

    cold<T = any>(marbles: string, values?: { [key: string]: T }, error?: any): ColdObservable<T> {

        const { testScheduler } = this;
        const observable = testScheduler.createColdObservable<T>(marbles, values, error);
        observable[argsSymbol] = { error, marbles, values };
        return observable;
    }

    equal<T = any>(actual: Observable<T>, expected: Observable<T>): void {

        assertArgs(expected);

        const { testScheduler } = this;
        const { error, marbles, values } = expected[argsSymbol];
        testScheduler.expectObservable(actual).toBe(marbles, values, error);
    }

    expect<T = any>(actual: Observable<T>): Expect<T> {

        const { testScheduler } = this;
        return new Expect(actual as any, testScheduler);
    }

    flush(): void {

        const { testScheduler } = this;
        testScheduler.flush();
    }

    has<T = any>(actual: Observable<T>, expected: string | string[]): void {

        assertSubscriptions(actual);

        const { testScheduler } = this;
        testScheduler.expectSubscriptions((actual as any).subscriptions).toBe(expected);
    }

    hot<T = any>(marbles: string, values?: { [key: string]: T }, error?: any): HotObservable<T> {

        const { testScheduler } = this;
        const observable = testScheduler.createHotObservable<T>(marbles, values, error);
        observable[argsSymbol] = { error, marbles, values };
        return observable;
    }

    get scheduler(): TestScheduler {

        const { testScheduler } = this;
        return testScheduler;
    }

    time(marbles: string): number {

        const { testScheduler } = this;
        return testScheduler.createTime(marbles);
    }
}
