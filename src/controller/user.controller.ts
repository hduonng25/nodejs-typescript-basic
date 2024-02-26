import { FilterQuery, PipelineStage } from 'mongoose';
import { v1 } from 'uuid';
import { IUser } from '~/interface/models';
import { UserBodyReq } from '~/interface/request';
import { Users } from '~/models';
import { success } from '~/result';

export async function get() {
    const match: FilterQuery<IUser> = {
        is_deleted: false,
    };

    const project = {
        _id: 0,
        id: 1,
        name: 1,
        age: 1,
        adress: 1,
    };

    const pipeline: PipelineStage[] = [
        { $match: match },
        { $project: project },
    ];

    const result = await Users.aggregate(pipeline);
    return success.ok(result);
}

export async function create(params: UserBodyReq) {
    const user = new Users({
        id: v1(),
        name: params.name,
        age: params.age,
        adress: params.adress,
    });

    return success.created(user);
}

export async function update(params: UserBodyReq) {
    const check = await Users.findOne({
        id: params.id,
        is_deleted: false,
    });

    if (check) {
        const update = await Users.findOneAndUpdate(
            { id: params.id, is_deleted: false },
            {
                $set: {
                    name: params.name,
                    adress: params.adress,
                    age: params.age,
                },
            },
            { new: true },
        );

        return success.ok(update);
    }
}

export async function deleted(params: { ids: string[] }) {
    let id: string;
    for (id of params.ids) {
        await Users.findOneAndUpdate(
            { id: id, is_deleted: false },
            { $set: { is_deleted: false } },
        );
    }

    return success.ok({
        mess: 'delete successfuly',
    });
}
