import { ApiProperty } from '@nestjs/swagger';
import { WefitterTeamDto } from './wefitter-team.dto';

export class WefitterProfileDto {
    constructor(data) {
        this.url = data.url;
        this.publicId = data.public_id;
        this.givenName = data.given_name;
        this.familyName = data.family_name;
        this.nickname = data.nickname;
        this.gender = data.gender;
        this.birthdate = data.birthdate;
        this.zoneinfo = data.zoneinfo;
        this.locale = data.locale;
        this.totalCalories = data.total_calories;
        this.totalDistance = data.total_distance;
        this.totalSteps = data.total_steps;
        this.totalPoints = data.total_points;
        this.totalActivityDuration = data.total_activity_duration;
        this.reference = data.reference;
        this.teams = data.teams;
        this.avatar = data.avatar;
        this.numActiveChallenges = data.num_active_challenges;
        this.numDoneChallenges = data.num_done_challenges;
        this.numFutureChallenges = data.num_future_challenges;
    }

    @ApiProperty({ type: () => String, required: false })
    readonly url: string;

    @ApiProperty({ type: () => String, required: true })
    readonly publicId: string;

    @ApiProperty({ type: () => String, required: false })
    readonly givenName: number;

    @ApiProperty({ type: () => String, required: false })
    readonly familyName: string;

    @ApiProperty({ type: () => String, required: false })
    readonly nickname: string;

    @ApiProperty({ type: () => String, required: false })
    readonly gender: string;

    @ApiProperty({ type: () => String, required: false })
    readonly birthdate: string;

    @ApiProperty({ type: () => String, required: false })
    readonly zoneinfo: string;

    @ApiProperty({ type: () => String, required: false })
    readonly locale: string;

    @ApiProperty({ type: () => Number, required: false })
    readonly totalCalories: string;

    @ApiProperty({ type: () => Number, required: false })
    readonly totalDistance: string;

    @ApiProperty({ type: () => Number, required: false })
    readonly totalSteps: string;

    @ApiProperty({ type: () => Number, required: false })
    readonly totalPoints: string;

    @ApiProperty({ type: () => Number, required: false })
    readonly totalActivityDuration: string;

    @ApiProperty({ type: () => String, required: true })
    readonly reference: string;

    @ApiProperty({ type: () => [WefitterTeamDto], required: false })
    readonly teams: WefitterTeamDto[];

    @ApiProperty({ type: () => String, required: false })
    readonly avatar: string;

    @ApiProperty({ type: () => String, required: false })
    readonly numActiveChallenges: string;

    @ApiProperty({ type: () => String, required: false })
    readonly numDoneChallenges: string;

    @ApiProperty({ type: () => String, required: false })
    readonly numFutureChallenges: string;
}