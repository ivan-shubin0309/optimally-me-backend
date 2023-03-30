import { Attributes, Model, Transaction } from 'sequelize/types';
import { Repository } from 'sequelize-typescript';
import { Directions } from '../resources/common/cursor-pagination';
import { Op, FindOptions, ScopeOptions } from 'sequelize';

export interface ICursorPaginationOptions {
    readonly cursorValue: number,
    readonly cursorKey: string,
    readonly limit: number,
    readonly direction: Directions,
    readonly reverse: boolean,
    readonly subQuery: boolean,
    readonly where?: any,
    readonly include?: any[],
}

const QUERY_BY_DIRECTIONS = {
    [Directions.next]: {
        queryDirection: Op.gt,
        orderDirection: 'ASC'
    },
    [Directions.previous]: {
        queryDirection: Op.lt,
        orderDirection: 'DESC'
    }
};

export class BaseService<T extends Model> {
    protected readonly model: Repository<T>;

    constructor(model: Repository<T>) {
        this.model = model;
    }

    getList(scopes: string | ScopeOptions | readonly (string | ScopeOptions)[] = [], transaction?: Transaction): Promise<T[]> {
        return this.model
            .scope(scopes)
            .findAll({ transaction });
    }

    getCount(scopes: string | ScopeOptions | readonly (string | ScopeOptions)[] = [], transaction?: Transaction): Promise<number> {
        return this.model
            .scope(scopes)
            .count({ transaction });
    }

    getOne(scopes: string | ScopeOptions | readonly (string | ScopeOptions)[] = [], transaction?: Transaction): Promise<T> {
        return this.model
            .scope(scopes)
            .findOne({ transaction });
    }

    getCountWithCursorPagination(scopes: string | ScopeOptions | readonly (string | ScopeOptions)[] = [], options?: ICursorPaginationOptions): Promise<number> {
        const paginationOptions = this.patchCursorPaginationOptions(options);
        const cursorColumn = options.cursorKey
            ? options.cursorKey
            : `${this.model.name}.id`;

        return this.model
            .scope(scopes)
            .count({ ...paginationOptions, distinct: true, col: cursorColumn });
    }

    async getListWithCursorPagination(scopes: string | ScopeOptions | readonly (string | ScopeOptions)[] = [], options?: ICursorPaginationOptions): Promise<T[]> {
        const query = this.patchCursorPaginationOptions(options);

        const reverse = options.reverse
            ? options.direction === Directions.next
            : options.direction === Directions.previous;

        const entities = await this.model.scope(scopes).findAll(query);

        if (reverse) {
            return entities.reverse();
        }

        return entities;
    }

    private patchCursorPaginationOptions(
        options: ICursorPaginationOptions = {
            cursorValue: 0,
            cursorKey: 'id',
            direction: Directions.next,
            limit: 1,
            subQuery: true,
            reverse: false,
            where: {},
            include: []
        }
    ): FindOptions<Attributes<T>> {
        const where = Object.assign({}, options.where);
        const cursorOptions = where[options.cursorKey] || {};
        let order;

        if (QUERY_BY_DIRECTIONS[options.direction]) {
            const queryDirection = QUERY_BY_DIRECTIONS[options.direction].queryDirection;
            const orderDirections = QUERY_BY_DIRECTIONS[options.direction].orderDirection;
            cursorOptions[queryDirection] = options.cursorValue;
            order = [[options.cursorKey, orderDirections]];
        }

        where[options.cursorKey] = cursorOptions;
        return {
            where,
            limit: options.limit,
            order,
            include: options.include && options.include.length
                ? options.include
                : undefined,
            subQuery: options.subQuery
        };
    }
}