import type { MeetingStatus } from "@domain/enum/meeting/meeting.status.enum";

export class MeetingEntity {
	private readonly _id?: string;
	private _projectId: string;
	private _title: string;
	private _link?: string;
	private _roomId: string;
	private _date: Date;
	private _type: "single" | "group";
	private _createdBy: string;
	private _status: MeetingStatus;
	private _participants: Array<{ userId: string; joinedAt?: Date }>;
	private _endTime?: Date;
	private _duration?: number;
	private _cancelledAt?: Date;
	private readonly _createdAt?: Date;
	private _updatedAt?: Date;

	private constructor(data: {
		id?: string;
		projectId: string;
		title: string;
		link?: string;
		roomId: string;
		date: Date;
		type: "single" | "group";
		createdBy: string;
		status: MeetingStatus;
		participants?: Array<{ userId: string; joinedAt?: Date }>;
		endTime?: Date;
		duration?: number;
		cancelledAt?: Date;
		createdAt?: Date;
		updatedAt?: Date;
	}) {
		this._id = data.id;
		this._projectId = data.projectId;
		this._title = data.title;
		this._link = data.link;
		this._roomId = data.roomId;
		this._date = data.date;
		this._type = data.type;
		this._createdBy = data.createdBy;
		this._status = data.status;
		this._participants = data.participants || [];
		this._endTime = data.endTime;
		this._duration = data.duration;
		this._cancelledAt = data.cancelledAt;
		this._createdAt = data.createdAt || new Date();
		this._updatedAt = data.updatedAt || new Date();
	}

	static create(data: {
		id?: string;
		projectId: string;
		title: string;
		link?: string;
		roomId?: string;
		date: Date;
		type: "single" | "group";
		createdBy: string;
		status: MeetingStatus;
		participants?: Array<{ userId: string; joinedAt?: Date }>;
		endTime?: Date;
		duration?: number;
		cancelledAt?: Date;
		createdAt?: Date;
		updatedAt?: Date;
	}): MeetingEntity {
		if (!data.title?.trim()) throw new Error("Meeting title is required");
		if (!data.projectId) throw new Error("ProjectId is required");

		const generatedRoomId =
			data.roomId || Math.random().toString(36).substring(2, 12);

		return new MeetingEntity({
			...data,
			title: data.title.trim(),
			roomId: generatedRoomId,
		});
	}

	get id(): string | undefined {
		return this._id;
	}

	get projectId(): string {
		return this._projectId;
	}

	get title(): string {
		return this._title;
	}

	get link(): string | undefined {
		return this._link;
	}

	get roomId(): string {
		return this._roomId;
	}

	get date(): Date {
		return this._date;
	}

	get type(): "single" | "group" {
		return this._type;
	}

	get createdBy(): string {
		return this._createdBy;
	}

	get status(): MeetingStatus {
		return this._status;
	}

	get participants() {
		return this._participants;
	}

	get endTime(): Date | undefined {
		return this._endTime;
	}

	get duration(): number | undefined {
		return this._duration;
	}

	get cancelledAt(): Date | undefined {
		return this._cancelledAt;
	}

	get createdAt(): Date | undefined {
		return this._createdAt;
	}

	get updatedAt(): Date | undefined {
		return this._updatedAt;
	}

	updateStatus(status: MeetingStatus) {
		this._status = status;
		this._updatedAt = new Date();
	}

	addParticipant(participant: { userId: string; joinedAt?: Date }) {
		const alreadyIn = this._participants.some(
			(p) => p.userId === participant.userId,
		);
		if (!alreadyIn) {
			this._participants.push({
				userId: participant.userId,
				joinedAt: participant.joinedAt || new Date(),
			});
			this._updatedAt = new Date();
		}
	}

	toJSON() {
		return {
			id: this._id,
			projectId: this._projectId,
			title: this._title,
			link: this._link,
			roomId: this._roomId,
			date: this._date,
			type: this._type,
			createdBy: this._createdBy,
			status: this._status,
			participants: this._participants,
			endTime: this._endTime,
			duration: this._duration,
			cancelledAt: this._cancelledAt,
			createdAt: this._createdAt,
			updatedAt: this._updatedAt,
		};
	}
}
